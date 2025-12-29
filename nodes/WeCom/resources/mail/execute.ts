import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeMail(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 发送邮件
			if (operation === 'sendMail') {
				const sender = this.getNodeParameter('sender', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const toListCollection = this.getNodeParameter('toListCollection', i, {}) as IDataObject;
				const ccListCollection = this.getNodeParameter('ccListCollection', i, {}) as IDataObject;
				const bccListCollection = this.getNodeParameter('bccListCollection', i, {}) as IDataObject;
				const contentType = this.getNodeParameter('contentType', i) as number;
				const content = this.getNodeParameter('content', i) as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;

				// 构建收件人
				const to_list: string[] = [];
				const cc_list: string[] = [];
				const bcc_list: string[] = [];

				if (toListCollection.recipients) {
					const toRecipients = toListCollection.recipients as IDataObject[];
					toRecipients.forEach((r) => {
						if (r.email) to_list.push(r.email as string);
					});
				}

				if (ccListCollection.recipients) {
					const ccRecipients = ccListCollection.recipients as IDataObject[];
					ccRecipients.forEach((r) => {
						if (r.email) cc_list.push(r.email as string);
					});
				}

				if (bccListCollection.recipients) {
					const bccRecipients = bccListCollection.recipients as IDataObject[];
					bccRecipients.forEach((r) => {
						if (r.email) bcc_list.push(r.email as string);
					});
				}

				const body: IDataObject = {
					sender,
					receiver: { to_list, cc_list, bcc_list },
					subject,
					doc_content: {
						content_type: contentType,
						content,
					},
				};

				// 处理附件
				if (attachmentCollection.attachments) {
					const attachments = attachmentCollection.attachments as IDataObject[];
					if (attachments.length > 0) {
						body.attachment_list = attachments.map((a) => ({
							type: a.type,
							media_id: a.media_id,
						}));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendScheduleMail') {
				const sender = this.getNodeParameter('sender', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const toListCollection = this.getNodeParameter('toListCollection', i, {}) as IDataObject;
				const ccListCollection = this.getNodeParameter('ccListCollection', i, {}) as IDataObject;
				const bccListCollection = this.getNodeParameter('bccListCollection', i, {}) as IDataObject;
				const calTitle = this.getNodeParameter('calTitle', i) as string;
				const calStartTime = this.getNodeParameter('calStartTime', i) as number;
				const calEndTime = this.getNodeParameter('calEndTime', i) as number;
				const calLocation = this.getNodeParameter('calLocation', i, '') as string;
				const calDescription = this.getNodeParameter('calDescription', i, '') as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;

				// 构建收件人
				const to_list: string[] = [];
				const cc_list: string[] = [];
				const bcc_list: string[] = [];

				if (toListCollection.recipients) {
					const toRecipients = toListCollection.recipients as IDataObject[];
					toRecipients.forEach((r) => {
						if (r.email) to_list.push(r.email as string);
					});
				}

				if (ccListCollection.recipients) {
					const ccRecipients = ccListCollection.recipients as IDataObject[];
					ccRecipients.forEach((r) => {
						if (r.email) cc_list.push(r.email as string);
					});
				}

				if (bccListCollection.recipients) {
					const bccRecipients = bccListCollection.recipients as IDataObject[];
					bccRecipients.forEach((r) => {
						if (r.email) bcc_list.push(r.email as string);
					});
				}

				// 构建日程内容
				const cal_content: IDataObject = {
					title: calTitle,
					start_time: calStartTime,
					end_time: calEndTime,
				};
				if (calLocation) cal_content.location = calLocation;
				if (calDescription) cal_content.description = calDescription;

				const body: IDataObject = {
					sender,
					receiver: { to_list, cc_list, bcc_list },
					subject,
					cal_content,
				};

				// 处理附件
				if (attachmentCollection.attachments) {
					const attachments = attachmentCollection.attachments as IDataObject[];
					if (attachments.length > 0) {
						body.attachment_list = attachments.map((a) => ({
							type: a.type,
							media_id: a.media_id,
						}));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			} else if (operation === 'sendMeetingMail') {
				const sender = this.getNodeParameter('sender', i) as string;
				const subject = this.getNodeParameter('subject', i) as string;
				const toListCollection = this.getNodeParameter('toListCollection', i, {}) as IDataObject;
				const ccListCollection = this.getNodeParameter('ccListCollection', i, {}) as IDataObject;
				const bccListCollection = this.getNodeParameter('bccListCollection', i, {}) as IDataObject;
				const meetingTitle = this.getNodeParameter('meetingTitle', i) as string;
				const meetingStartTime = this.getNodeParameter('meetingStartTime', i) as number;
				const meetingEndTime = this.getNodeParameter('meetingEndTime', i) as number;
				const meetingLocation = this.getNodeParameter('meetingLocation', i, '') as string;
				const meetingDescription = this.getNodeParameter('meetingDescription', i, '') as string;
				const attachmentCollection = this.getNodeParameter('attachmentCollection', i, {}) as IDataObject;

				// 构建收件人
				const to_list: string[] = [];
				const cc_list: string[] = [];
				const bcc_list: string[] = [];

				if (toListCollection.recipients) {
					const toRecipients = toListCollection.recipients as IDataObject[];
					toRecipients.forEach((r) => {
						if (r.email) to_list.push(r.email as string);
					});
				}

				if (ccListCollection.recipients) {
					const ccRecipients = ccListCollection.recipients as IDataObject[];
					ccRecipients.forEach((r) => {
						if (r.email) cc_list.push(r.email as string);
					});
				}

				if (bccListCollection.recipients) {
					const bccRecipients = bccListCollection.recipients as IDataObject[];
					bccRecipients.forEach((r) => {
						if (r.email) bcc_list.push(r.email as string);
					});
				}

				// 构建会议内容
				const meeting_content: IDataObject = {
					title: meetingTitle,
					start_time: meetingStartTime,
					end_time: meetingEndTime,
				};
				if (meetingLocation) meeting_content.location = meetingLocation;
				if (meetingDescription) meeting_content.description = meetingDescription;

				const body: IDataObject = {
					sender,
					receiver: { to_list, cc_list, bcc_list },
					subject,
					meeting_content,
				};

				// 处理附件
				if (attachmentCollection.attachments) {
					const attachments = attachmentCollection.attachments as IDataObject[];
					if (attachments.length > 0) {
						body.attachment_list = attachments.map((a) => ({
							type: a.type,
							media_id: a.media_id,
						}));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/compose_send', body);
			}
			// 获取接收的邮件
			else if (operation === 'getMailList') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const begin_time = this.getNodeParameter('begin_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					mailbox,
					begin_time,
					end_time,
					limit,
				};

				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/getlist', body);
			} else if (operation === 'getMailContent') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const mailid = this.getNodeParameter('mailid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/get', {
					mailbox,
					mailid,
				});
			}
			// 管理应用邮箱账号
			else if (operation === 'updateAppMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const remark = this.getNodeParameter('remark', i, '') as string;

				const body: IDataObject = { mailbox };
				if (name) body.name = name;
				if (remark) body.remark = remark;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/update', body);
			} else if (operation === 'getAppMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/app/get', { mailbox });
			}
			// 管理邮件群组
			else if (operation === 'createMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;
				const groupname = this.getNodeParameter('groupname', i) as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const allow_type = this.getNodeParameter('allow_type', i, 0) as number;

				const body: IDataObject = {
					groupid,
					groupname,
					allow_type,
				};

				if (userlist) {
					body.userlist = userlist.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/create', body);
			} else if (operation === 'updateMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;
				const groupname = this.getNodeParameter('groupname', i, '') as string;
				const userlist = this.getNodeParameter('userlist', i, '') as string;
				const allow_type = this.getNodeParameter('allow_type', i, 0) as number;

				const body: IDataObject = {
					groupid,
					allow_type,
				};

				if (groupname) body.groupname = groupname;
				if (userlist) {
					body.userlist = userlist.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/update', body);
			} else if (operation === 'deleteMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/delete', { groupid });
			} else if (operation === 'getMailGroup') {
				const groupid = this.getNodeParameter('groupid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/get', { groupid });
			} else if (operation === 'searchMailGroup') {
				const fuzzy_groupid = this.getNodeParameter('fuzzy_groupid', i) as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					fuzzy_groupid,
					limit,
				};

				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/group/search', body);
			}
			// 管理公共邮箱
			else if (operation === 'createPublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const name = this.getNodeParameter('name', i) as string;
				const admin_list = this.getNodeParameter('admin_list', i, '') as string;
				const member_list = this.getNodeParameter('member_list', i, '') as string;

				const body: IDataObject = {
					mailbox,
					name,
				};

				if (admin_list) {
					body.admin_list = admin_list.split(',').map((email) => email.trim());
				}
				if (member_list) {
					body.member_list = member_list.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/create', body);
			} else if (operation === 'updatePublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const name = this.getNodeParameter('name', i, '') as string;
				const admin_list = this.getNodeParameter('admin_list', i, '') as string;
				const member_list = this.getNodeParameter('member_list', i, '') as string;

				const body: IDataObject = { mailbox };

				if (name) body.name = name;
				if (admin_list) {
					body.admin_list = admin_list.split(',').map((email) => email.trim());
				}
				if (member_list) {
					body.member_list = member_list.split(',').map((email) => email.trim());
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/update', body);
			} else if (operation === 'deletePublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/delete', { mailbox });
			} else if (operation === 'getPublicMailbox') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/get', { mailbox });
			} else if (operation === 'searchPublicMailbox') {
				const fuzzy_mailbox = this.getNodeParameter('fuzzy_mailbox', i) as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = {
					fuzzy_mailbox,
					limit,
				};

				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/publicmailbox/search', body);
			}
			// 客户端专用密码
			else if (operation === 'getClientPasswordList') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/list', { mailbox });
			} else if (operation === 'deleteClientPassword') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const password_id = this.getNodeParameter('password_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/useroption/delete', {
					mailbox,
					password_id,
				});
			}
			// 高级功能账号管理
			else if (operation === 'allocateMailAdvancedAccount') {
				const mailbox_list = this.getNodeParameter('mailbox_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/batchadd', {
					mailbox: mailbox_list.split(',').map((email) => email.trim()),
				});
			} else if (operation === 'deallocateMailAdvancedAccount') {
				const mailbox_list = this.getNodeParameter('mailbox_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/batchdel', {
					mailbox: mailbox_list.split(',').map((email) => email.trim()),
				});
			} else if (operation === 'getMailAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/vip/list', body);
			} else if (operation === 'toggleMailboxStatus') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const operation_type = this.getNodeParameter('operation_type', i) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/user/option', {
					mailbox,
					operation: operation_type,
				});
			}
			// 其他邮件客户端登录设置
			else if (operation === 'getUserMailAttribute') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/user/get', { mailbox });
			} else if (operation === 'updateUserMailAttribute') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;
				const autoReplySettings = this.getNodeParameter('autoReplySettings', i, {}) as IDataObject;
				const autoForwardSettings = this.getNodeParameter('autoForwardSettings', i, {}) as IDataObject;
				const imapSmtpSettings = this.getNodeParameter('imapSmtpSettings', i, {}) as IDataObject;

				const body: IDataObject = { mailbox };

				// 处理自动回复设置
				if (autoReplySettings.enabled !== undefined) {
					body.auto_reply = {
						enabled: autoReplySettings.enabled,
					};
					if (autoReplySettings.enabled) {
						if (autoReplySettings.text) {
							(body.auto_reply as IDataObject).text = autoReplySettings.text;
						}
						if (autoReplySettings.only_to_contact !== undefined) {
							(body.auto_reply as IDataObject).only_to_contact = autoReplySettings.only_to_contact;
						}
					}
				}

				// 处理自动转发设置
				if (autoForwardSettings.enabled !== undefined) {
					body.auto_forward = {
						enabled: autoForwardSettings.enabled,
					};
					if (autoForwardSettings.enabled) {
						if (autoForwardSettings.to_addr) {
							(body.auto_forward as IDataObject).to_addr = autoForwardSettings.to_addr;
						}
						if (autoForwardSettings.keep_copy !== undefined) {
							(body.auto_forward as IDataObject).keep_copy = autoForwardSettings.keep_copy;
						}
					}
				}

				// 处理IMAP/SMTP设置
				if (imapSmtpSettings.enable_imap !== undefined) {
					body.enable_imap = imapSmtpSettings.enable_imap;
				}
				if (imapSmtpSettings.enable_smtp !== undefined) {
					body.enable_smtp = imapSmtpSettings.enable_smtp;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/user/update', body);
			} else if (operation === 'getMailUnreadCount') {
				const mailbox = this.getNodeParameter('mailbox', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/exmail/mail/unread', { mailbox });
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
