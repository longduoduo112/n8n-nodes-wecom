import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeKf(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 客服账号管理
			if (operation === 'addKfAccount') {
				const name = this.getNodeParameter('name', i) as string;
				const media_id = this.getNodeParameter('media_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/add', {
					name,
					media_id,
				});
			} else if (operation === 'delKfAccount') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/del', {
					open_kfid,
				});
			} else if (operation === 'updateKfAccount') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const media_id = this.getNodeParameter('media_id', i, '') as string;

				const body: IDataObject = { open_kfid };
				if (name) body.name = name;
				if (media_id) body.media_id = media_id;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/update', body);
			} else if (operation === 'listKfAccount') {
				const limit = this.getNodeParameter('limit', i, 50) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/account/list', body);
			} else if (operation === 'getKfAccountLink') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const scene = this.getNodeParameter('scene', i, '') as string;

				const body: IDataObject = { open_kfid };
				if (scene) body.scene = scene;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/add_contact_way', body);
			}
			// 接待人员管理
			else if (operation === 'addServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/add', {
					open_kfid,
					userid_list: userid_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'delServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/servicer/del', {
					open_kfid,
					userid_list: userid_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'listServicer') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;

				response = await weComApiRequest.call(
					this,
					'GET',
					'/cgi-bin/kf/servicer/list',
					{},
					{ open_kfid },
				);
			}
			// 会话分配与消息收发
			else if (operation === 'transServiceState') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const service_state = this.getNodeParameter('service_state', i) as number;
				const servicer_userid = this.getNodeParameter('servicer_userid', i, '') as string;

				const body: IDataObject = {
					open_kfid,
					external_userid,
					service_state,
				};

				if (servicer_userid) body.servicer_userid = servicer_userid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/service_state/trans', body);
			} else if (operation === 'sendKfMsg') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const touser = this.getNodeParameter('touser', i) as string;
				const msgtype = this.getNodeParameter('msgtype', i) as string;

				// 根据消息类型构建消息内容
				let messageContent: IDataObject = {};

				if (msgtype === 'text') {
					const content = this.getNodeParameter('text_content', i) as string;
					messageContent = { content };
				} else if (msgtype === 'image') {
					const media_id = this.getNodeParameter('image_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'voice') {
					const media_id = this.getNodeParameter('voice_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'video') {
					const media_id = this.getNodeParameter('video_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'file') {
					const media_id = this.getNodeParameter('file_media_id', i) as string;
					messageContent = { media_id };
				} else if (msgtype === 'link') {
					const title = this.getNodeParameter('link_title', i) as string;
					const desc = this.getNodeParameter('link_desc', i, '') as string;
					const url = this.getNodeParameter('link_url', i) as string;
					const thumb_url = this.getNodeParameter('link_thumb_url', i, '') as string;

					messageContent = { title, url };
					if (desc) messageContent.desc = desc;
					if (thumb_url) messageContent.thumb_url = thumb_url;
				} else if (msgtype === 'miniprogram') {
					const title = this.getNodeParameter('miniprogram_title', i) as string;
					const appid = this.getNodeParameter('miniprogram_appid', i) as string;
					const pagepath = this.getNodeParameter('miniprogram_pagepath', i) as string;
					const thumb_media_id = this.getNodeParameter('miniprogram_thumb_media_id', i) as string;

					messageContent = { title, appid, pagepath, thumb_media_id };
				} else if (msgtype === 'msgmenu') {
					const head_content = this.getNodeParameter('msgmenu_head_content', i) as string;
					const tail_content = this.getNodeParameter('msgmenu_tail_content', i, '') as string;
					const menuItems = this.getNodeParameter('msgmenu_list.items', i, []) as IDataObject[];

					const list = menuItems.map((item: IDataObject) => {
						const menuItem: IDataObject = {
							type: item.type,
							content: item.content,
						};

						if (item.type === 'click') {
							menuItem.id = item.reply_content || '';
						} else if (item.type === 'view') {
							menuItem.url = item.url || '';
						} else if (item.type === 'miniprogram') {
							menuItem.appid = item.appid || '';
							menuItem.pagepath = item.pagepath || '';
						}

						return menuItem;
					});

					messageContent = { head_content, list };
					if (tail_content) messageContent.tail_content = tail_content;
				} else if (msgtype === 'location') {
					const name = this.getNodeParameter('location_name', i) as string;
					const address = this.getNodeParameter('location_address', i) as string;
					const latitude = this.getNodeParameter('location_latitude', i) as number;
					const longitude = this.getNodeParameter('location_longitude', i) as number;

					messageContent = { name, address, latitude, longitude };
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`不支持的消息类型: ${msgtype}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg', {
					touser,
					open_kfid,
					msgtype,
					[msgtype]: messageContent,
				});
			} else if (operation === 'sendKfEventMsg') {
				const code = this.getNodeParameter('code', i) as string;
				const msgtype = this.getNodeParameter('msgtype', i) as string;

				// 根据消息类型构建消息内容
				let messageContent: IDataObject = {};

				if (msgtype === 'text') {
					const content = this.getNodeParameter('text_content', i) as string;
					messageContent = { content };
				} else if (msgtype === 'msgmenu') {
					const head_content = this.getNodeParameter('msgmenu_head_content', i) as string;
					const tail_content = this.getNodeParameter('msgmenu_tail_content', i, '') as string;
					const menuItems = this.getNodeParameter('msgmenu_list.items', i, []) as IDataObject[];

					const list = menuItems.map((item: IDataObject) => {
						const menuItem: IDataObject = {
							type: item.type,
							content: item.content,
						};

						if (item.type === 'click') {
							menuItem.id = item.reply_content || '';
						} else if (item.type === 'view') {
							menuItem.url = item.url || '';
						} else if (item.type === 'miniprogram') {
							menuItem.appid = item.appid || '';
							menuItem.pagepath = item.pagepath || '';
						}

						return menuItem;
					});

					messageContent = { head_content, list };
					if (tail_content) messageContent.tail_content = tail_content;
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`不支持的消息类型: ${msgtype}`,
						{ itemIndex: i },
					);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/send_msg_on_event', {
					code,
					msgtype,
					[msgtype]: messageContent,
				});
			} else if (operation === 'setUpgradeService') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const upgradeType = this.getNodeParameter('upgradeType', i) as string;

				const upgrade_config: IDataObject = {};

				if (upgradeType === 'member') {
					const memberCollection = this.getNodeParameter('memberCollection', i, {}) as IDataObject;
					const userid_list: string[] = [];

					if (memberCollection.members) {
						const membersList = memberCollection.members as IDataObject[];
						membersList.forEach((m) => {
							if (m.userid) userid_list.push(m.userid as string);
						});
					}

					upgrade_config.member_range = { userid_list };
				} else if (upgradeType === 'groupchat') {
					const groupchatCollection = this.getNodeParameter('groupchatCollection', i, {}) as IDataObject;
					const chatid_list: string[] = [];

					if (groupchatCollection.groups) {
						const groupsList = groupchatCollection.groups as IDataObject[];
						groupsList.forEach((g) => {
							if (g.chat_id) chatid_list.push(g.chat_id as string);
						});
					}

					upgrade_config.groupchat_range = { chatid_list };
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/upgrade_service_config', {
					open_kfid,
					upgrade_config,
				});
			} else if (operation === 'syncMsg') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const token = this.getNodeParameter('token', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const voice_format = this.getNodeParameter('voice_format', i, 0) as number;
				const parse_message_types = this.getNodeParameter('parse_message_types', i, true) as boolean;

				const body: IDataObject = {
					open_kfid,
					limit,
					voice_format,
				};

				if (cursor) body.cursor = cursor;
				if (token) body.token = token;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/sync_msg', body);

				// 如果需要解析消息类型，对msg_list进行处理
				if (parse_message_types && response.msg_list && Array.isArray(response.msg_list)) {
					response.msg_list = (response.msg_list as IDataObject[]).map((msg: IDataObject) => {
						const msgtype = msg.msgtype as string;
						
						// 为每个消息添加解析后的字段，便于后续处理
						const parsedMsg: IDataObject = {
							...msg,
							parsed_content: null,
						};

						// 根据消息类型解析内容
						if (msgtype === 'text' && msg.text) {
							parsedMsg.parsed_content = msg.text;
						} else if (msgtype === 'image' && msg.image) {
							parsedMsg.parsed_content = msg.image;
						} else if (msgtype === 'voice' && msg.voice) {
							parsedMsg.parsed_content = msg.voice;
						} else if (msgtype === 'video' && msg.video) {
							parsedMsg.parsed_content = msg.video;
						} else if (msgtype === 'file' && msg.file) {
							parsedMsg.parsed_content = msg.file;
						} else if (msgtype === 'location' && msg.location) {
							parsedMsg.parsed_content = msg.location;
						} else if (msgtype === 'link' && msg.link) {
							parsedMsg.parsed_content = msg.link;
						} else if (msgtype === 'business_card' && msg.business_card) {
							parsedMsg.parsed_content = msg.business_card;
						} else if (msgtype === 'miniprogram' && msg.miniprogram) {
							parsedMsg.parsed_content = msg.miniprogram;
						} else if (msgtype === 'msgmenu' && msg.msgmenu) {
							parsedMsg.parsed_content = msg.msgmenu;
						} else if (msgtype === 'channels_shop_product' && msg.channels_shop_product) {
							parsedMsg.parsed_content = msg.channels_shop_product;
						} else if (msgtype === 'channels_shop_order' && msg.channels_shop_order) {
							parsedMsg.parsed_content = msg.channels_shop_order;
						} else if (msgtype === 'merged_msg' && msg.merged_msg) {
							parsedMsg.parsed_content = msg.merged_msg;
						} else if (msgtype === 'channels' && msg.channels) {
							parsedMsg.parsed_content = msg.channels;
						} else if (msgtype === 'event' && msg.event) {
							parsedMsg.parsed_content = msg.event;
							// 为事件类型添加event_type字段方便筛选
							parsedMsg.event_type = (msg.event as IDataObject).event_type;
						}

						return parsedMsg;
					});
				}
			} else if (operation === 'getCustomerInfo') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/customer/get_upgrade_service_config', {
					open_kfid,
					external_userid,
				});
			}
			// 统计管理
			else if (operation === 'getCorpStatistic') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/get_corp_statistic', {
					open_kfid,
					start_time,
					end_time,
				});
			} else if (operation === 'getServicerStatistic') {
				const open_kfid = this.getNodeParameter('open_kfid', i) as string;
				const servicer_userid = this.getNodeParameter('servicer_userid', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/kf/get_servicer_statistic', {
					open_kfid,
					servicer_userid,
					start_time,
					end_time,
				});
			}
			// 机器人管理
			else if (operation === 'manageKnowledgeGroup') {
				const action_type = this.getNodeParameter('action_type', i) as string;

				let endpoint = '';
				const body: IDataObject = {};

				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_group';
					const group_name = this.getNodeParameter('group_name', i) as string;
					body.name = group_name;
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_group';
					const group_id = this.getNodeParameter('group_id', i) as string;
					body.group_id = group_id;
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_group';
					const group_id = this.getNodeParameter('group_id', i) as string;
					const new_group_name = this.getNodeParameter('new_group_name', i) as string;
					body.group_id = group_id;
					body.name = new_group_name;
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_group';
					const cursor = this.getNodeParameter('cursor', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;
					if (cursor) body.cursor = cursor;
					body.limit = limit;
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (operation === 'manageKnowledgeIntent') {
				const action_type = this.getNodeParameter('action_type', i) as string;

				let endpoint = '';
				const body: IDataObject = {};

				if (action_type === 'add') {
					endpoint = '/cgi-bin/kf/knowledge/add_intent';
					const group_id = this.getNodeParameter('group_id', i) as string;
					const question_text = this.getNodeParameter('question_text', i) as string;
					const answer_type = this.getNodeParameter('answer_type', i) as string;
					const answer_text = this.getNodeParameter('answer_text', i) as string;
					const similarQuestionsCollection = this.getNodeParameter('similarQuestionsCollection', i, {}) as IDataObject;

					// 构建问题
					const question: IDataObject = { text: question_text };
					if (similarQuestionsCollection.questions) {
						const similarList = similarQuestionsCollection.questions as IDataObject[];
						if (similarList.length > 0) {
							question.similar_questions = similarList.map((q) => ({ text: q.text }));
						}
					}

					// 构建回答
					const answer: IDataObject[] = [{ msgtype: answer_type, [answer_type]: { content: answer_text } }];

					body.group_id = group_id;
					body.question = question;
					body.answer = answer;
				} else if (action_type === 'del') {
					endpoint = '/cgi-bin/kf/knowledge/del_intent';
					const intent_id = this.getNodeParameter('intent_id', i) as string;
					body.intent_id = intent_id;
				} else if (action_type === 'mod') {
					endpoint = '/cgi-bin/kf/knowledge/mod_intent';
					const intent_id = this.getNodeParameter('intent_id', i) as string;
					const question_text = this.getNodeParameter('question_text', i) as string;
					const answer_type = this.getNodeParameter('answer_type', i) as string;
					const answer_text = this.getNodeParameter('answer_text', i) as string;
					const similarQuestionsCollection = this.getNodeParameter('similarQuestionsCollection', i, {}) as IDataObject;

					// 构建问题
					const question: IDataObject = { text: question_text };
					if (similarQuestionsCollection.questions) {
						const similarList = similarQuestionsCollection.questions as IDataObject[];
						if (similarList.length > 0) {
							question.similar_questions = similarList.map((q) => ({ text: q.text }));
						}
					}

					// 构建回答
					const answer: IDataObject[] = [{ msgtype: answer_type, [answer_type]: { content: answer_text } }];

					body.intent_id = intent_id;
					body.question = question;
					body.answer = answer;
				} else if (action_type === 'list') {
					endpoint = '/cgi-bin/kf/knowledge/list_intent';
					const group_id = this.getNodeParameter('group_id', i) as string;
					const cursor = this.getNodeParameter('cursor', i, '') as string;
					const limit = this.getNodeParameter('limit', i, 100) as number;
					body.group_id = group_id;
					if (cursor) body.cursor = cursor;
					body.limit = limit;
				}

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
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
