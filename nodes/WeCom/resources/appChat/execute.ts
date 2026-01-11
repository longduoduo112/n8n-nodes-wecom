import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeAppChat(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const parseOptionalJsonParameter = (
		value: unknown,
		parameterName: string,
		itemIndex: number,
	): IDataObject | IDataObject[] | undefined => {
		if (value === undefined || value === null) {
			return undefined;
		}
		if (typeof value === 'string') {
			const trimmed = value.trim();
			if (!trimmed || trimmed === '{}' || trimmed === '[]') {
				return undefined;
			}
			try {
				return JSON.parse(trimmed) as IDataObject | IDataObject[];
			} catch (error) {
				throw new NodeOperationError(
					this.getNode(),
					`${parameterName} 必须是有效的 JSON: ${(error as Error).message}`,
					{ itemIndex },
				);
			}
		}
		return value as IDataObject | IDataObject[];
	};
	const resolveSafeValue = (value: unknown): number | undefined => {
		if (value === undefined || value === null) {
			return undefined;
		}
		if (typeof value === 'boolean') {
			return value ? 1 : 0;
		}
		if (typeof value === 'number') {
			return value;
		}
		if (typeof value === 'string') {
			const parsed = Number.parseInt(value, 10);
			return Number.isNaN(parsed) ? undefined : parsed;
		}
		return undefined;
	};

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation === 'createAppChat') {
				// 创建群聊会话
				const name = this.getNodeParameter('name', i, '') as string;
				const owner = this.getNodeParameter('owner', i, '') as string;
				const userlist = this.getNodeParameter('userlist', i) as string;
				const chatid = this.getNodeParameter('chatid', i, '') as string;

				const body: IDataObject = {
					userlist: userlist.split(',').map((id) => id.trim()),
				};

				if (name) {
					body.name = name;
				}

				if (owner) {
					body.owner = owner;
				}

				if (chatid) {
					body.chatid = chatid;
				}

				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/appchat/create',
					body,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} else if (operation === 'updateAppChat') {
				// 修改群聊会话
				const chatid = this.getNodeParameter('chatid', i) as string;
				const updateType = this.getNodeParameter('updateType', i) as string;

				const body: IDataObject = {
					chatid,
				};

				if (updateType === 'name' || updateType === 'combined') {
					const name = this.getNodeParameter('name', i, '') as string;
					if (name) {
						body.name = name;
					}
				}

				if (updateType === 'owner' || updateType === 'combined') {
					const owner = this.getNodeParameter('owner', i, '') as string;
					if (owner) {
						body.owner = owner;
					}
				}

				if (updateType === 'addUsers' || updateType === 'combined') {
					const add_user_list = this.getNodeParameter('add_user_list', i, '') as string;
					if (add_user_list) {
						body.add_user_list = add_user_list.split(',').map((id) => id.trim());
					}
				}

				if (updateType === 'delUsers' || updateType === 'combined') {
					const del_user_list = this.getNodeParameter('del_user_list', i, '') as string;
					if (del_user_list) {
						body.del_user_list = del_user_list.split(',').map((id) => id.trim());
					}
				}

				const response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/appchat/update',
					body,
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} else if (operation === 'getAppChat') {
				// 获取群聊会话
				const chatid = this.getNodeParameter('chatid', i) as string;

				const response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/appchat/get',
					{},
					{
						chatid,
					},
				);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			} else {
				// 发送消息到群聊会话
				const chatid = this.getNodeParameter('chatid', i) as string;
				let body: IDataObject = {
					chatid,
				};

				if (operation === 'sendText') {
					const content = this.getNodeParameter('content', i) as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'text',
						text: {
							content,
						},
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendImage') {
					const mediaId = this.getNodeParameter('media_ID', i) as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'image',
						image: {
							media_id: mediaId,
						},
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendFile') {
					const mediaId = this.getNodeParameter('media_ID', i) as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'file',
						file: {
							media_id: mediaId,
						},
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendMarkdown') {
					const content = this.getNodeParameter('content', i) as string;

					body = {
						...body,
						msgtype: 'markdown',
						markdown: {
							content,
						},
					};
				} else if (operation === 'sendNews') {
					const newsInputMode = this.getNodeParameter('news_input_mode', i, 'form') as string;
					const newsJson = newsInputMode === 'json'
						? parseOptionalJsonParameter(
							this.getNodeParameter('news_json', i, '[]') as string,
							'news_json',
							i,
						)
						: undefined;
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					let articleList: IDataObject[] = [];
					let safeValue: number | undefined = safe ? 1 : 0;

					if (newsInputMode === 'json') {
						if (!newsJson) {
							throw new NodeOperationError(
								this.getNode(),
								'请选择 JSON 输入并提供 news_json',
								{ itemIndex: i },
							);
						}
						if (Array.isArray(newsJson)) {
							articleList = newsJson as IDataObject[];
						} else if ((newsJson as IDataObject).news) {
							const newsPayload = (newsJson as IDataObject).news as IDataObject;
							if (!Array.isArray(newsPayload.articles)) {
								throw new NodeOperationError(
									this.getNode(),
									'news_json.news 必须包含 articles 数组',
									{ itemIndex: i },
								);
							}
							articleList = newsPayload.articles as IDataObject[];
						} else if (Array.isArray((newsJson as IDataObject).articles)) {
							articleList = (newsJson as IDataObject).articles as IDataObject[];
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'news_json 必须是图文数组或包含 articles 的对象',
								{ itemIndex: i },
							);
						}

						const safeFromJson = resolveSafeValue((newsJson as IDataObject).safe);
						if (safeFromJson !== undefined) {
							safeValue = safeFromJson;
						}
					} else {
						articleList = (articles.article as IDataObject[]) || [];
					}

					body = {
						...body,
						msgtype: 'news',
						news: {
							articles: articleList,
						},
					};

					if (safeValue !== undefined) {
						body.safe = safeValue;
					}
				} else if (operation === 'sendVoice') {
					const mediaId = this.getNodeParameter('media_ID', i) as string;

					body = {
						...body,
						msgtype: 'voice',
						voice: {
							media_id: mediaId,
						},
					};
				} else if (operation === 'sendVideo') {
					const mediaId = this.getNodeParameter('media_ID', i) as string;
					const title = this.getNodeParameter('title', i, '') as string;
					const description = this.getNodeParameter('description', i, '') as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					const videoData: IDataObject = {
						media_id: mediaId,
					};

					if (title) {
						videoData.title = title;
					}

					if (description) {
						videoData.description = description;
					}

					body = {
						...body,
						msgtype: 'video',
						video: videoData,
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendTextCard') {
					const textcardInputMode = this.getNodeParameter(
						'textcard_input_mode',
						i,
						'form',
					) as string;
					const textcardJson = textcardInputMode === 'json'
						? parseOptionalJsonParameter(
							this.getNodeParameter('textcard_json', i, '{}') as string,
							'textcard_json',
							i,
						)
						: undefined;
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const btntxt = this.getNodeParameter('btntxt', i, '详情') as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					let textcard: IDataObject;
					let safeValue: number | undefined = safe ? 1 : 0;

					if (textcardInputMode === 'json') {
						if (!textcardJson) {
							throw new NodeOperationError(
								this.getNode(),
								'请选择 JSON 输入并提供 textcard_json',
								{ itemIndex: i },
							);
						}
						if (Array.isArray(textcardJson)) {
							throw new NodeOperationError(
								this.getNode(),
								'textcard_json 必须是对象',
								{ itemIndex: i },
							);
						}
						const textcardPayload = (textcardJson as IDataObject).textcard as IDataObject | undefined;
						textcard = textcardPayload ?? (textcardJson as IDataObject);
						const safeFromJson = resolveSafeValue((textcardJson as IDataObject).safe);
						if (safeFromJson !== undefined) {
							safeValue = safeFromJson;
						}
					} else {
						textcard = {
							title,
							description,
							url,
							btntxt,
						};
					}

					body = {
						...body,
						msgtype: 'textcard',
						textcard,
					};

					if (safeValue !== undefined) {
						body.safe = safeValue;
					}
				} else if (operation === 'sendMpNews') {
					const mpnewsInputMode = this.getNodeParameter('mpnews_input_mode', i, 'form') as string;
					const mpnewsJson = mpnewsInputMode === 'json'
						? parseOptionalJsonParameter(
							this.getNodeParameter('mpnews_json', i, '[]') as string,
							'mpnews_json',
							i,
						)
						: undefined;
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					let articleList: IDataObject[] = [];
					let safeValue: number | undefined = safe ? 1 : 0;

					if (mpnewsInputMode === 'json') {
						if (!mpnewsJson) {
							throw new NodeOperationError(
								this.getNode(),
								'请选择 JSON 输入并提供 mpnews_json',
								{ itemIndex: i },
							);
						}
						if (Array.isArray(mpnewsJson)) {
							articleList = mpnewsJson as IDataObject[];
						} else if ((mpnewsJson as IDataObject).mpnews) {
							const mpnewsPayload = (mpnewsJson as IDataObject).mpnews as IDataObject;
							if (!Array.isArray(mpnewsPayload.articles)) {
								throw new NodeOperationError(
									this.getNode(),
									'mpnews_json.mpnews 必须包含 articles 数组',
									{ itemIndex: i },
								);
							}
							articleList = mpnewsPayload.articles as IDataObject[];
						} else if (Array.isArray((mpnewsJson as IDataObject).articles)) {
							articleList = (mpnewsJson as IDataObject).articles as IDataObject[];
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'mpnews_json 必须是图文数组或包含 articles 的对象',
								{ itemIndex: i },
							);
						}

						const safeFromJson = resolveSafeValue((mpnewsJson as IDataObject).safe);
						if (safeFromJson !== undefined) {
							safeValue = safeFromJson;
						}
					} else {
						articleList = (articles.article as IDataObject[]) || [];
					}

					body = {
						...body,
						msgtype: 'mpnews',
						mpnews: {
							articles: articleList,
						},
					};

					if (safeValue !== undefined) {
						body.safe = safeValue;
					}
				}

				const response = await weComApiRequest.call(this, 'POST', '/cgi-bin/appchat/send', body);

				returnData.push({
					json: response as IDataObject,
					pairedItem: { item: i },
				});
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
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
