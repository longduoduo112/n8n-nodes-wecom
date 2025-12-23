import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import {
	WeComCrypto,
	generateReplyMessageXML,
	generateEncryptedResponseXML,
} from '../../shared/crypto';

export async function executePassiveReply(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation === 'reply') {
				const item = items[i];

				const wecomCrypto = item.json._wecomCrypto as {
					token: string;
					encodingAESKey: string;
					corpId: string;
				};

				if (!wecomCrypto || !wecomCrypto.token || !wecomCrypto.encodingAESKey || !wecomCrypto.corpId) {
					throw new NodeOperationError(
						this.getNode(),
						'缺少企业微信加密信息。请确保工作流结构为：企业微信消息接收（被动回复）触发器 → 本节点',
						{ itemIndex: i },
					);
				}

				const fromUserName = item.json.FromUserName as string;
				const toUserName = item.json.ToUserName as string;

				if (!fromUserName || !toUserName) {
					throw new NodeOperationError(
						this.getNode(),
						'缺少消息发送者或接收者信息，请确保输入数据来自「企业微信消息接收（被动回复）触发器」',
						{ itemIndex: i },
					);
				}

				const replyType = this.getNodeParameter('replyType', i, 'text') as 'text' | 'image' | 'voice' | 'video' | 'news' | 'update_template_card';
				let replyContent: Record<string, unknown> = {};

				switch (replyType) {
					case 'text': {
						const textContent = this.getNodeParameter('textContent', i) as string;
						if (!textContent) {
							throw new NodeOperationError(
								this.getNode(),
								'文本内容不能为空',
								{ itemIndex: i },
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
								{ itemIndex: i },
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
								{ itemIndex: i },
							);
						}

						const formattedArticles = articles.map(article => ({
							Title: article.title,
							Description: article.description || '',
							Url: article.url,
							PicUrl: article.picUrl || '',
						}));

						replyContent = { Articles: formattedArticles };
						break;
					}

					case 'update_template_card': {
						const buttonReplaceName = this.getNodeParameter('buttonReplaceName', i, '') as string;

						if (buttonReplaceName) {
							replyContent = { Button: { ReplaceName: buttonReplaceName } };
						} else {
							const cardType = this.getNodeParameter('cardType', i) as string;
							const cardSourceData = this.getNodeParameter('cardSource', i, {}) as IDataObject;
							const cardMainTitleData = this.getNodeParameter('cardMainTitle', i, {}) as IDataObject;
							const cardEmphasisContentData = this.getNodeParameter('cardEmphasisContent', i, {}) as IDataObject;
							const cardQuoteAreaData = this.getNodeParameter('cardQuoteArea', i, {}) as IDataObject;
							const cardSubTitleText = this.getNodeParameter('cardSubTitleText', i, '') as string;
							const cardHorizontalContentListData = this.getNodeParameter('cardHorizontalContentList', i, {}) as IDataObject;
							const cardJumpListData = this.getNodeParameter('cardJumpList', i, {}) as IDataObject;
							const cardActionData = this.getNodeParameter('cardAction', i, {}) as IDataObject;
							const cardTaskId = this.getNodeParameter('cardTaskId', i, '') as string;
							const cardActionMenuData = this.getNodeParameter('cardActionMenu', i, {}) as IDataObject;

							const templateCard: Record<string, unknown> = {
								CardType: cardType,
							};

							if (cardSourceData.source) {
								templateCard.Source = cardSourceData.source;
							}

							if (cardMainTitleData.mainTitle) {
								templateCard.MainTitle = cardMainTitleData.mainTitle;
							}

							if (cardEmphasisContentData.emphasisContent) {
								templateCard.EmphasisContent = cardEmphasisContentData.emphasisContent;
							}

							if (cardQuoteAreaData.quoteArea) {
								templateCard.QuoteArea = cardQuoteAreaData.quoteArea;
							}

							if (cardSubTitleText) {
								templateCard.SubTitleText = cardSubTitleText;
							}

							if (cardHorizontalContentListData.items && Array.isArray(cardHorizontalContentListData.items)) {
								templateCard.HorizontalContentList = cardHorizontalContentListData.items;
							}

							if (cardJumpListData.items && Array.isArray(cardJumpListData.items)) {
								templateCard.JumpList = cardJumpListData.items;
							}

							if (cardActionData.action) {
								templateCard.CardAction = cardActionData.action;
							}

							if (cardTaskId) {
								templateCard.TaskId = cardTaskId;
							}

							if (cardActionMenuData.actionMenu) {
								const actionMenu = cardActionMenuData.actionMenu as IDataObject;
								const menuData: IDataObject = {};
								if (actionMenu.desc) {
									menuData.desc = actionMenu.desc;
								}
								if (actionMenu.action_list) {
									const actionListData = actionMenu.action_list as IDataObject;
									if (actionListData.actions && Array.isArray(actionListData.actions)) {
										menuData.action_list = actionListData.actions;
									}
								}
								if (Object.keys(menuData).length > 0) {
									templateCard.ActionMenu = menuData;
								}
							}

							if (cardType === 'button_interaction') {
								const cardButtonListData = this.getNodeParameter('cardButtonList', i, {}) as IDataObject;
								if (cardButtonListData.buttons && Array.isArray(cardButtonListData.buttons)) {
									templateCard.ButtonList = cardButtonListData.buttons;
								}
							} else if (cardType === 'vote_interaction' || cardType === 'multiple_interaction') {
								const cardCheckboxQuestionKey = this.getNodeParameter('cardCheckboxQuestionKey', i, '') as string;
								const cardCheckboxMode = this.getNodeParameter('cardCheckboxMode', i, 'single') as string;
								const cardOptionListData = this.getNodeParameter('cardOptionList', i, {}) as IDataObject;
								const cardSubmitButtonText = this.getNodeParameter('cardSubmitButtonText', i, '提交') as string;
								const cardSubmitButtonKey = this.getNodeParameter('cardSubmitButtonKey', i, '') as string;

								if (cardCheckboxQuestionKey) {
									templateCard.Checkbox = {
										QuestionKey: cardCheckboxQuestionKey,
										Mode: cardCheckboxMode,
										OptionList: cardOptionListData.options || [],
									};
								}

								if (cardSubmitButtonKey) {
									templateCard.SubmitButton = {
										Text: cardSubmitButtonText,
										Key: cardSubmitButtonKey,
									};
								}
							} else if (cardType === 'news_notice') {
								const cardImageTextAreaData = this.getNodeParameter('cardImageTextArea', i, {}) as IDataObject;
								if (cardImageTextAreaData.imageText) {
									templateCard.ImageTextArea = cardImageTextAreaData.imageText;
								}
							}

							replyContent = { TemplateCard: templateCard };
						}
						break;
					}
				}

				const crypto = new WeComCrypto(wecomCrypto.encodingAESKey, wecomCrypto.corpId);

				const replyMessageXML = generateReplyMessageXML(
					fromUserName,
					toUserName,
					replyType,
					replyContent,
				);

				const encryptedResponseXML = generateEncryptedResponseXML(
					crypto,
					wecomCrypto.token,
					replyMessageXML,
					this.getNode(),
				);

				this.sendResponse({
					body: encryptedResponseXML,
					headers: {
						'Content-Type': 'text/xml; charset=utf-8',
					},
					statusCode: 200,
				});

				returnData.push({
					json: {
						success: true,
						repliedAt: new Date().toISOString(),
					} as IDataObject,
					pairedItem: { item: i },
				});
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
						success: false,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}

