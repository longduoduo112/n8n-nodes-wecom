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
export class WeComSuiteTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信第三方应用指令回调触发器 (WeCom)',
		name: 'weComSuiteTrigger',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['trigger'],
		version: 1,
		subtitle: '接收第三方应用指令回调事件',
		description: '接收企业微信第三方应用的指令回调事件（授权、通讯录变更、ticket变化等）',
		defaults: {
			name: '企业微信第三方应用指令回调',
		},
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'weComSuiteReceiveApi',
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
				placeholder: 'suite/receive',
				description: 'Webhook URL 的路径，建议使用应用相关的唯一标识',
				hint: '例如：suite/receive，对应指令回调URL：https://your-domain.com/suite/receive',
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
						description: '接收所有类型的回调事件',
					},
					{
						name: '授权成功',
						value: 'create_auth',
						description: '企业授权成功通知（从应用市场发起授权时推送）',
					},
					{
						name: '变更授权',
						value: 'change_auth',
						description: '企业变更授权通知（修改授权范围、权限等）',
					},
					{
						name: '取消授权',
						value: 'cancel_auth',
						description: '企业取消授权通知',
					},
					{
						name: '通讯录变更',
						value: 'change_contact',
						description: '通讯录变更事件（成员、部门、标签等）',
					},
					{
						name: '新增成员',
						value: 'change_contact_create_user',
						description: '新增成员事件（create_user）',
					},
					{
						name: '更新成员',
						value: 'change_contact_update_user',
						description: '更新成员事件（update_user）',
					},
					{
						name: '删除成员',
						value: 'change_contact_delete_user',
						description: '删除成员事件（delete_user）',
					},
					{
						name: '新增部门',
						value: 'change_contact_create_party',
						description: '新增部门事件（create_party）',
					},
					{
						name: '更新部门',
						value: 'change_contact_update_party',
						description: '更新部门事件（update_party）',
					},
					{
						name: '删除部门',
						value: 'change_contact_delete_party',
						description: '删除部门事件（delete_party）',
					},
					{
						name: '标签成员变更',
						value: 'change_contact_update_tag',
						description: '标签成员变更事件（update_tag）',
					},
					{
						name: 'Suite Ticket推送',
						value: 'suite_ticket',
						description: 'Suite Ticket推送事件（每10分钟推送一次）',
					},
					{
						name: '应用变更',
						value: 'change_app',
						description: '应用变更事件',
					},
					{
						name: '企业互联共享应用变更',
						value: 'share_agent_change',
						description: '企业互联共享应用事件回调（共享/移除应用）',
					},
					{
						name: '上下游共享应用变更',
						value: 'share_chain_change',
						description: '上下游共享应用事件回调（共享/移除应用）',
					},
					{
						name: '重置永久授权码通知',
						value: 'reset_permanent_code',
						description: '重置永久授权码通知（代开发应用重新获取secret时触发）',
					},
					{
						name: '应用管理员变更',
						value: 'change_app_admin',
						description: '应用管理员变更通知（修改应用负责人时触发）',
					},
					{
						name: '授权组织架构权限',
						value: 'corp_arch_auth',
						description: '授权组织架构权限通知（企业同意授权组织架构权限时触发）',
					},
					{
						name: '获客助手权限确认',
						value: 'approve_special_auth',
						description: '获客助手权限确认事件（管理员完成权限确认时触发）',
					},
					{
						name: '获客助手权限取消',
						value: 'cancel_special_auth',
						description: '获客助手权限取消事件（管理员取消权限授权时触发）',
					},
					{
						name: '支付成功通知',
						value: 'license_pay_success',
						description: '接口调用许可支付成功通知（当服务商购买接口调用许可账号并完成付款后推送）',
					},
					{
						name: '退款结果通知',
						value: 'license_refund',
						description: '接口调用许可退款结果通知（当服务商提交退款申请的订单发生状态变更时推送）',
					},
					{
						name: '自动激活回调通知',
						value: 'auto_activate',
						description: '接口调用许可自动激活回调通知（当企业成员满足自动激活条件并触发自动激活后推送）',
					},
					{
						name: '下单成功通知',
						value: 'open_order',
						description: '下单成功通知（当企业在应用市场购买付费应用完成下单后，或服务商在管理端为企业代下单后推送）',
					},
					{
						name: '改单通知',
						value: 'change_order',
						description: '改单通知（当服务商管理员修改订单价格后推送，会产生新的订单号）',
					},
					{
						name: '支付成功通知',
						value: 'pay_for_app_success',
						description: '支付成功通知（当企业对某一个订单完成付款后推送）',
					},
					{
						name: '退款通知',
						value: 'refund',
						description: '退款通知（当某个客户发起有效的退款，经服务商在管理端同意后或过期自动完成退款后推送）',
					},
					{
						name: '应用版本变更通知',
						value: 'change_editon',
						description: '应用版本变更通知（付费版本购买/扩容/续期、退款成功、试用期变更、版本到期等情况下推送）',
					},
					{
						name: '取消订单通知',
						value: 'cancel_order',
						description: '取消订单通知（当服务商或客户企业取消订单后推送）',
					},
				],
				default: ['*'],
				required: true,
				description: '选择要接收的回调事件类型',
				hint: '可以选择多个类型，如果选择"所有事件"则接收所有回调事件',
			},
			{
				displayName: '返回原始数据',
				name: 'returnRawData',
				type: 'boolean',
				default: false,
				description: '是否返回未解析的原始XML数据',
				hint: '开启后会在输出中包含原始的XML字符串',
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
		const credentials = await this.getCredentials('weComSuiteReceiveApi');
		const { suiteId, token, encodingAESKey } = credentials as {
			suiteId: string;
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
			// 注意：在第三方回调事件中，receiveid的内容为suiteid
			const crypto = new WeComCrypto(encodingAESKey, suiteId);
			const decryptedEchostr = crypto.decrypt(echostr as string, this.getNode());

			return {
				webhookResponse: decryptedEchostr,
			};
		}

		// POST 请求：接收回调事件
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
		// 注意：在第三方回调事件中，receiveid的内容为suiteid
		const crypto = new WeComCrypto(encodingAESKey, suiteId);
		const decryptedMsg = crypto.decrypt(Encrypt, this.getNode());

		// 解析解密后的 XML 消息
		const messageData = parseXML(decryptedMsg);

		// 过滤事件类型
		const events = this.getNodeParameter('events', []) as string[];
		const infoType = messageData.InfoType || messageData.Event || 'unknown';
		const changeType = messageData.ChangeType || '';

		// 检查是否应该处理此事件
		let shouldProcess = false;

		// 如果选择了所有事件，直接处理
		if (events.includes('*')) {
			shouldProcess = true;
		} else {
			// 对于 change_contact 事件，需要检查 InfoType 和 ChangeType
			if (infoType === 'change_contact') {
				// 如果选择了 change_contact（所有通讯录变更事件），则处理
				if (events.includes('change_contact')) {
					shouldProcess = true;
				}
				// 如果选择了具体的 change_contact 子类型，检查 ChangeType
				else if (changeType) {
					const specificEventType = `change_contact_${changeType}`;
					if (events.includes(specificEventType)) {
						shouldProcess = true;
					}
				}
			} else {
				// 其他事件类型直接匹配 InfoType
				if (events.includes(infoType)) {
					shouldProcess = true;
				}
			}
		}

		if (!shouldProcess) {
			// 不处理此类型的事件，返回 success
			return {
				webhookResponse: 'success',
			};
		}

		// 准备返回数据
		const returnRawData = this.getNodeParameter('returnRawData', false) as boolean;
		const outputData: IDataObject = {
			...messageData,
			receivedAt: new Date().toISOString(),
			ToUserName: messageData.ToUserName || suiteId,
		};

		if (returnRawData) {
			outputData.rawXML = decryptedMsg;
		}

		// 返回数据并响应 success（必须返回 "success"）
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
