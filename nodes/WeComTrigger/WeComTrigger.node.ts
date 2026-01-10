import type {
	IHookFunctions,
	IWebhookFunctions,
	IWebhookResponseData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import {
	WeComCrypto,
	parseXML,
} from '../WeCom/shared/crypto';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信消息接收触发器 (WeCom)',
		name: 'weComTrigger',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['trigger'],
		version: 1,
		subtitle: '接收企业微信消息回调',
		description: '接收企业微信应用消息、事件等回调通知',
		defaults: {
			name: '企业微信消息接收',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComReceiveApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: '={{$parameter.path}}',
				isFullPath: true,
			},
			{
				name: 'setup',
				httpMethod: 'GET',
				responseMode: 'onReceived',
				path: '={{$parameter.path}}',
				isFullPath: true,
			},
		],
		properties: [
			{
				displayName: 'Path',
				name: 'path',
				type: 'string',
				default: '',
				required: true,
				placeholder: '同一应用ID路径要求唯一',
				description: 'Webhook URL 的路径，建议使用应用 ID',
			},
			{
				displayName: '事件类型',
				name: 'events',
				type: 'multiOptions',
				// eslint-disable-next-line n8n-nodes-base/node-param-multi-options-type-unsorted-items
				options: [
					{
						name: '所有事件',
						value: '*',
						description: '接收所有类型的消息和事件',
					},
					{
						name: '事件消息',
						value: 'event',
						description: '接收事件推送（如成员变更、部门变更等）',
					},
					{
						name: '位置消息',
						value: 'location',
						description: '接收用户发送的位置消息',
					},
					{
						name: '图片消息',
						value: 'image',
						description: '接收用户发送的图片消息',
					},
					{
						name: '文本消息',
						value: 'text',
						description: '接收用户发送的文本消息',
					},
					{
						name: '视频消息',
						value: 'video',
						description: '接收用户发送的视频消息',
					},
					{
						name: '语音消息',
						value: 'voice',
						description: '接收用户发送的语音消息',
					},
					{
						name: '链接消息',
						value: 'link',
						description: '接收用户发送的链接消息',
					},
					{
						name: '接口许可失效通知',
						value: 'unlicensed_notify',
						description: '接收接口许可失效通知事件（当许可账号失效的企业成员访问应用时触发）',
					},
					{
						name: '异步任务完成通知',
						value: 'batch_job_result',
						description: '接收异步任务完成通知事件，包括导出任务（导出成员、导出成员详情、导出部门、导出标签成员）和批量操作任务（增量更新成员、全量覆盖成员、邀请成员关注、全量覆盖部门）。当异步任务执行完毕时会触发此事件',
					},
					{
						name: '通讯录变更通知',
						value: 'change_contact',
						description: '接收通讯录变更通知事件，包括成员变更（新增成员、更新成员、删除成员）、部门变更（新增部门、更新部门、删除部门）和标签变更（标签成员变更）。该事件会回调给通讯录同步助手、代开发自建应用以及上游企业共享的应用。对于2022年8月15号后通讯录助手新配置或修改的回调URL，成员属性只回调UserID/Department等有限字段，部门属性只回调ID/ParentId等有限字段。标签成员变更事件与成员变更事件的时序不保证先后',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的消息和事件类型',
				hint: '可以选择多个类型，如果选择"所有事件"则接收所有消息。接口许可失效通知事件类型为 unlicensed_notify，异步任务完成通知事件类型为 batch_job_result（包含导出任务和批量操作任务），通讯录变更通知事件类型为 change_contact（包含成员变更：新增/更新/删除成员，部门变更：新增/更新/删除部门，标签变更：标签成员变更）',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: 'Whether to return unparsed raw XML data',
				hint: '开启后会在输出中包含原始的 XML 字符串',
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async create(this: IHookFunctions): Promise<boolean> {
				return true;
			},
			async delete(this: IHookFunctions): Promise<boolean> {
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const webhookName = this.getWebhookName();
		const credentials = await this.getCredentials('weComReceiveApi');
		const { corpId, token, encodingAESKey } = credentials as {
			corpId: string;
			token: string;
			encodingAESKey: string;
		};

		const query = this.getQueryData() as IDataObject;
		const { msg_signature, timestamp, nonce, echostr } = query;

		// GET 请求：URL 验证
		if (webhookName === 'setup') {
			if (!msg_signature || !timestamp || !nonce || !echostr) {
				throw new NodeOperationError(this.getNode(), '缺少必要的验证参数');
			}

			// 验证签名
			const isValid = WeComCrypto.verifySignature(
				msg_signature as string,
				token,
				timestamp as string,
				nonce as string,
				echostr as string,
			);

			if (!isValid) {
				throw new NodeOperationError(this.getNode(), '签名验证失败');
			}

			// 解密 echostr
			const crypto = new WeComCrypto(encodingAESKey, corpId);
			const decryptedEchostr = crypto.decrypt(echostr as string, this.getNode());

			return {
				webhookResponse: decryptedEchostr,
			};
		}

		// POST 请求：接收消息
		// 获取原始请求对象以读取 XML body
		const req = this.getRequestObject();
		let rawBody = '';

		// 尝试多种方式获取原始 XML 数据
		if (req.rawBody) {
			// n8n 在某些情况下会提供 rawBody
			rawBody = req.rawBody.toString('utf8');
		} else if (typeof req.body === 'string') {
			// body 本身就是字符串
			rawBody = req.body;
		} else if (req.body && typeof req.body === 'object') {
			// body 是对象，尝试从常见字段获取
			const bodyData = req.body as IDataObject;
			if (bodyData.data && typeof bodyData.data === 'string') {
				rawBody = bodyData.data;
			} else if (bodyData.xml && typeof bodyData.xml === 'string') {
				rawBody = bodyData.xml;
			} else {
				// 最后尝试 JSON 序列化（不太可能是正确的 XML）
				rawBody = JSON.stringify(bodyData);
			}
		}

		if (!rawBody) {
			throw new NodeOperationError(this.getNode(), '无法获取请求体数据');
		}

		// 解析 XML
		const xmlData = parseXML(rawBody);
		const { Encrypt } = xmlData;

		if (!Encrypt) {
			throw new NodeOperationError(
				this.getNode(),
				`无效的消息格式：缺少加密数据。收到的数据：${rawBody.substring(0, 200)}`,
			);
		}

		// 验证签名
		const isValid = WeComCrypto.verifySignature(
			msg_signature as string,
			token,
			timestamp as string,
			nonce as string,
			Encrypt,
		);

		if (!isValid) {
			throw new NodeOperationError(this.getNode(), '消息签名验证失败');
		}

		// 解密消息
		const crypto = new WeComCrypto(encodingAESKey, corpId);
		const decryptedMsg = crypto.decrypt(Encrypt, this.getNode());

		// 解析解密后的 XML 消息
		const messageData = parseXML(decryptedMsg);

		// 过滤事件类型
		const events = this.getNodeParameter('events', []) as string[];
		const msgType = messageData.MsgType || 'unknown';
		const eventType = messageData.Event || 'unknown';

		// 检查是否匹配：支持按消息类型（MsgType）或事件类型（Event）过滤
		const shouldProcess =
			events.includes('*') ||
			events.includes(msgType) ||
			events.includes(eventType) ||
			// 如果选择了"事件消息"（event），则接收所有事件类型
			(msgType === 'event' && events.includes('event'));

		if (!shouldProcess) {
			// 不处理此类型的消息，返回 success
			return {
				webhookResponse: 'success',
			};
		}

		// 准备返回数据
		const returnRawData = this.getNodeParameter('returnRawData', false) as boolean;
		const outputData: IDataObject = {
			...messageData,
			receivedAt: new Date().toISOString(),
		};

		if (returnRawData) {
			outputData.rawXML = decryptedMsg;
		}

		// 返回数据并响应 success
		return {
			workflowData: [
				[
					{
						json: outputData,
					},
				],
			],
			webhookResponse: 'success',
		};
	}
}
