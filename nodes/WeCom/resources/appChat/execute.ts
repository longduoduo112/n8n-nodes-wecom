import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeAppChat(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

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
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const articleList = (articles.article as IDataObject[]) || [];
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'news',
						news: {
							articles: articleList,
						},
						safe: safe ? 1 : 0,
					};
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
					const title = this.getNodeParameter('title', i) as string;
					const description = this.getNodeParameter('description', i) as string;
					const url = this.getNodeParameter('url', i) as string;
					const btntxt = this.getNodeParameter('btntxt', i, '详情') as string;
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'textcard',
						textcard: {
							title,
							description,
							url,
							btntxt,
						},
						safe: safe ? 1 : 0,
					};
				} else if (operation === 'sendMpNews') {
					const articles = this.getNodeParameter('articles', i, {}) as IDataObject;
					const articleList = (articles.article as IDataObject[]) || [];
					const safe = this.getNodeParameter('safe', i, false) as boolean;

					body = {
						...body,
						msgtype: 'mpnews',
						mpnews: {
							articles: articleList,
						},
						safe: safe ? 1 : 0,
					};
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

