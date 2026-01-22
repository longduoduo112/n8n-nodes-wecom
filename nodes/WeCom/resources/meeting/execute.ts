import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

// 辅助函数：将dateTime转换为Unix时间戳（秒级）
function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

export async function executeMeeting(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 预约会议基础管理
			if (operation === 'createMeeting') {
				const subject = this.getNodeParameter('subject', i) as string;
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);
				const type = this.getNodeParameter('type', i) as number;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;

				const body: IDataObject = {
					subject,
					start_time,
					end_time,
					type,
				};

				// 处理参会人员
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					if (attendeesList.length > 0) {
						body.attendees = attendeesList.map((a) => ({ userid: a.userid }));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const subject = this.getNodeParameter('subject', i, '') as string;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;

				const body: IDataObject = { meetingid };
				if (subject) body.subject = subject;
				if (start_time_raw) {
					const start_time = dateTimeToUnixTimestamp(start_time_raw);
					if (start_time > 0) body.start_time = start_time;
				}
				if (end_time_raw) {
					const end_time = dateTimeToUnixTimestamp(end_time_raw);
					if (end_time > 0) body.end_time = end_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'cancelMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/cancel', {
					meetingid,
				});
			} else if (operation === 'getMeetingInfo') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_info', {
					meetingid,
				});
			} else if (operation === 'getUserMeetings') {
				const userid = this.getNodeParameter('userid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { userid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meeting_id', body);
			}
			// 会议统计管理
			else if (operation === 'getMeetingRecords') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;

				const body: IDataObject = { meetingid };
				if (start_time_raw) {
					const start_time = dateTimeToUnixTimestamp(start_time_raw);
					if (start_time > 0) body.start_time = start_time;
				}
				if (end_time_raw) {
					const end_time = dateTimeToUnixTimestamp(end_time_raw);
					if (end_time > 0) body.end_time = end_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meeting_list', body);
			}
			// 预约会议高级管理
			else if (operation === 'createAdvancedMeeting') {
				const subject = this.getNodeParameter('subject', i) as string;
				const start_time = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i) as string | number);
				const end_time = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i) as string | number);
				const admin_userid = this.getNodeParameter('admin_userid', i) as string;
				const inviteesCollection = this.getNodeParameter('inviteesCollection', i, {}) as IDataObject;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;

				const body: IDataObject = {
					subject,
					start_time,
					end_time,
					admin_userid,
				};

				// 处理受邀成员
				if (inviteesCollection.invitees) {
					const inviteesList = inviteesCollection.invitees as IDataObject[];
					if (inviteesList.length > 0) {
						body.invitees = inviteesList.map((inv) => ({ userid: inv.userid }));
					}
				}

				// 处理高级设置
				if (advancedSettings.description) body.description = advancedSettings.description;
				if (advancedSettings.password) body.password = advancedSettings.password;
				if (advancedSettings.enable_mute_on_entry !== undefined) {
					body.enable_mute_on_entry = advancedSettings.enable_mute_on_entry;
				}
				if (advancedSettings.allow_enter_before_host !== undefined) {
					body.allow_enter_before_host = advancedSettings.allow_enter_before_host;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/create', body);
			} else if (operation === 'updateAdvancedMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const subject = this.getNodeParameter('subject', i, '') as string;
				const start_time_raw = this.getNodeParameter('start_time', i, '') as string | number;
				const end_time_raw = this.getNodeParameter('end_time', i, '') as string | number;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;

				const body: IDataObject = { meetingid };
				if (subject) body.subject = subject;
				if (start_time_raw) {
					const start_time = dateTimeToUnixTimestamp(start_time_raw);
					if (start_time > 0) body.start_time = start_time;
				}
				if (end_time_raw) {
					const end_time = dateTimeToUnixTimestamp(end_time_raw);
					if (end_time > 0) body.end_time = end_time;
				}

				// 处理高级设置
				if (advancedSettings.description) body.description = advancedSettings.description;
				if (advancedSettings.password) body.password = advancedSettings.password;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update', body);
			} else if (operation === 'getMeetingInvitees') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const limit = this.getNodeParameter('limit', i, 20) as number;

				const body: IDataObject = { meetingid, limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_invitees', body);
			} else if (operation === 'updateMeetingInvitees') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const addInviteesCollection = this.getNodeParameter('addInviteesCollection', i, {}) as IDataObject;
				const delInviteesCollection = this.getNodeParameter('delInviteesCollection', i, {}) as IDataObject;

				const body: IDataObject = { meetingid };

				// 处理添加的成员
				if (addInviteesCollection.invitees) {
					const addList = addInviteesCollection.invitees as IDataObject[];
					if (addList.length > 0) {
						body.add_invitees = addList.map((inv) => ({ userid: inv.userid }));
					}
				}

				// 处理删除的成员
				if (delInviteesCollection.invitees) {
					const delList = delInviteesCollection.invitees as IDataObject[];
					if (delList.length > 0) {
						body.del_invitees = delList.map((inv) => ({ userid: inv.userid }));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/update_invitees', body);
			} else if (operation === 'getLiveParticipants') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 100) as number;

				const body: IDataObject = { meetingid, size };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_participants', body);
			} else if (operation === 'getParticipants') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 100) as number;

				const body: IDataObject = { meetingid, size };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_user_meeting_list', body);
			}
			// 会中控制管理
			else if (operation === 'muteMember') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const mute_action = this.getNodeParameter('mute_action', i) as number;
				const membersCollection = this.getNodeParameter('membersCollection', i, {}) as IDataObject;

				const userid_list: string[] = [];
				if (membersCollection.members) {
					const membersList = membersCollection.members as IDataObject[];
					membersList.forEach((m) => {
						if (m.userid) userid_list.push(m.userid as string);
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/mute', {
					meetingid,
					action: mute_action,
					userid_list,
				});
			} else if (operation === 'removeMember') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const membersCollection = this.getNodeParameter('membersCollection', i, {}) as IDataObject;

				const userid_list: string[] = [];
				if (membersCollection.members) {
					const membersList = membersCollection.members as IDataObject[];
					membersList.forEach((m) => {
						if (m.userid) userid_list.push(m.userid as string);
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/kick_user', {
					meetingid,
					userid_list,
				});
			} else if (operation === 'endMeeting') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/dismiss', {
					meetingid,
				});
			}
			// 录制管理
			else if (operation === 'listRecordings') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const cursor = this.getNodeParameter('cursor', i, '') as string;
				const size = this.getNodeParameter('size', i, 100) as number;

				const body: IDataObject = { meetingid, size };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_meeting_record_list', body);
			} else if (operation === 'getRecordingAddress') {
				const meetingid = this.getNodeParameter('meetingid', i) as string;
				const record_file_id = this.getNodeParameter('record_file_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/get_meeting_record', {
					meetingid,
					record_file_id,
				});
			}
			// 高级功能账号管理
			else if (operation === 'allocateMeetingAdvancedAccount') {
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const userid_list: string[] = [];
				if (useridCollection.users) {
					const usersList = useridCollection.users as IDataObject[];
					usersList.forEach((u) => {
						if (u.userid) userid_list.push(u.userid as string);
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip_batch_add', {
					userid_list,
				});
			} else if (operation === 'deallocateMeetingAdvancedAccount') {
				const useridCollection = this.getNodeParameter('useridCollection', i, {}) as IDataObject;

				const userid_list: string[] = [];
				if (useridCollection.users) {
					const usersList = useridCollection.users as IDataObject[];
					usersList.forEach((u) => {
						if (u.userid) userid_list.push(u.userid as string);
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip_batch_del', {
					userid_list,
				});
			} else if (operation === 'getMeetingAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/meeting/vip_list', body);
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
