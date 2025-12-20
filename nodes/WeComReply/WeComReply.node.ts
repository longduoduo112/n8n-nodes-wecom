import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError, NodeConnectionTypes } from 'n8n-workflow';
import {
	WeComCrypto,
	generateReplyMessageXML,
	generateEncryptedResponseXML,
} from '../WeCom/shared/crypto';

// eslint-disable-next-line @n8n/community-nodes/node-usable-as-tool
export class WeComReply implements INodeType {
	description: INodeTypeDescription = {
		displayName: '企业微信被动回复',
		name: 'weComReply',
		// eslint-disable-next-line @n8n/community-nodes/icon-validation
		icon: { light: 'file:../../icons/wecom.png', dark: 'file:../../icons/wecom.dark.png' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter.replyType}}',
		description: '被动回复企业微信消息（需配合企业微信消息接收 Trigger 使用）',
		defaults: {
			name: '企业微信被动回复',
		},
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		properties: [
			{
				displayName: '回复消息类型',
				name: 'replyType',
				type: 'options',
				options: [
					{
						name: '文本消息',
						value: 'text',
						description: '回复文本消息',
					},
					{
						name: '图片消息',
						value: 'image',
						description: '回复图片消息',
					},
					{
						name: '语音消息',
						value: 'voice',
						description: '回复语音消息',
					},
					{
						name: '视频消息',
						value: 'video',
						description: '回复视频消息',
					},
					{
						name: '图文消息',
						value: 'news',
						description: '回复图文消息',
					},
				],
				default: 'text',
				description: '被动回复的消息类型',
			},
			{
				displayName: '文本内容',
				name: 'textContent',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				displayOptions: {
					show: {
						replyType: ['text'],
					},
				},
				default: '',
				required: true,
				description: '回复的文本内容',
				placeholder: '感谢您的消息！',
			},
			{
				displayName: '媒体ID',
				name: 'mediaId',
				type: 'string',
				displayOptions: {
					show: {
						replyType: ['image', 'voice', 'video'],
					},
				},
				default: '',
				required: true,
				description: '媒体文件ID（需先通过素材管理接口上传获得）',
				hint: '可以使用表达式从前面节点获取，如：{{$json.media_id}}',
			},
			{
				displayName: '视频标题',
				name: 'videoTitle',
				type: 'string',
				displayOptions: {
					show: {
						replyType: ['video'],
					},
				},
				default: '',
				description: '视频标题（可选）',
			},
			{
				displayName: '视频描述',
				name: 'videoDescription',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				displayOptions: {
					show: {
						replyType: ['video'],
					},
				},
				default: '',
				description: '视频描述（可选）',
			},
			{
				displayName: '图文消息',
				name: 'articles',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				displayOptions: {
					show: {
						replyType: ['news'],
					},
				},
				default: {},
				placeholder: '添加图文',
				options: [
					{
						name: 'article',
						displayName: '图文',
						values: [
							{
								displayName: '标题',
								name: 'title',
								type: 'string',
								default: '',
								required: true,
								description: '图文标题',
							},
							{
								displayName: '描述',
								name: 'description',
								type: 'string',
								typeOptions: {
									rows: 2,
								},
								default: '',
								description: '图文描述',
							},
							{
								displayName: '链接',
								name: 'url',
								type: 'string',
								default: '',
								required: true,
								description: '点击后跳转的链接',
							},
							{
								displayName: '封面图片链接',
								name: 'picUrl',
								type: 'string',
								default: '',
								description: '图文封面图片URL',
							},
						],
					},
				],
				description: '图文消息列表',
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const item = items[i];

				// 从输入数据中获取加密信息
				const wecomCrypto = item.json._wecomCrypto as {
					token: string;
					encodingAESKey: string;
					corpId: string;
				};

				if (!wecomCrypto || !wecomCrypto.token || !wecomCrypto.encodingAESKey || !wecomCrypto.corpId) {
					throw new NodeOperationError(
						this.getNode(),
						'缺少企业微信加密信息，请确保此节点连接到"企业微信消息接收 Trigger"节点之后',
					);
				}

				// 获取消息发送者和接收者信息
				const fromUserName = item.json.FromUserName as string;
				const toUserName = item.json.ToUserName as string;

				if (!fromUserName || !toUserName) {
					throw new NodeOperationError(
						this.getNode(),
						'缺少消息发送者或接收者信息，请确保输入数据来自"企业微信消息接收 Trigger"',
					);
				}

				// 获取回复类型
				const replyType = this.getNodeParameter('replyType', i) as 'text' | 'image' | 'voice' | 'video' | 'news';

				// 根据消息类型构建回复内容
				let replyContent: Record<string, unknown> = {};

				switch (replyType) {
					case 'text': {
						const textContent = this.getNodeParameter('textContent', i) as string;
						if (!textContent) {
							throw new NodeOperationError(
								this.getNode(),
								'文本内容不能为空',
							);
						}
						replyContent = { Content: textContent };
						break;
					}

					case 'image':
					case 'voice':
					case 'video': {
						const mediaId = this.getNodeParameter('mediaId', i) as string;
						if (!mediaId) {
							throw new NodeOperationError(
								this.getNode(),
								'媒体ID不能为空',
							);
						}
						replyContent = { MediaId: mediaId };

						if (replyType === 'video') {
							const videoTitle = this.getNodeParameter('videoTitle', i, '') as string;
							const videoDescription = this.getNodeParameter('videoDescription', i, '') as string;
							if (videoTitle) replyContent.Title = videoTitle;
							if (videoDescription) replyContent.Description = videoDescription;
						}
						break;
					}

					case 'news': {
						const articlesData = this.getNodeParameter('articles', i) as {
							article?: Array<{
								title: string;
								description?: string;
								url: string;
								picUrl?: string;
							}>;
						};

						const articles = articlesData.article || [];

						if (articles.length === 0) {
							throw new NodeOperationError(
								this.getNode(),
								'至少需要添加一篇图文消息',
							);
						}

						// 转换为企业微信格式
						const formattedArticles = articles.map(article => ({
							Title: article.title,
							Description: article.description || '',
							Url: article.url,
							PicUrl: article.picUrl || '',
						}));

						replyContent = { Articles: formattedArticles };
						break;
					}
				}

				// 创建加密实例
				const crypto = new WeComCrypto(wecomCrypto.encodingAESKey, wecomCrypto.corpId);

				// 生成回复消息 XML
				const replyMessageXML = generateReplyMessageXML(
					fromUserName,  // ToUserName: 发送给消息的发送者
					toUserName,    // FromUserName: 来自应用
					replyType,
					replyContent,
				);

				// 生成加密的响应 XML
				const encryptedResponseXML = generateEncryptedResponseXML(
					crypto,
					wecomCrypto.token,
					replyMessageXML,
					this.getNode(),
				);

				// 返回加密的 XML 作为响应
				// 使用 n8n webhook 的特殊格式来返回自定义响应
				returnData.push({
					json: {
						body: encryptedResponseXML,
						headers: {
							'Content-Type': 'application/xml',
						},
						statusCode: 200,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: (error as Error).message,
						},
						pairedItem: i,
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
