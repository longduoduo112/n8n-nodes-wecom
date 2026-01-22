import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeCalendar(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 管理日历
			if (operation === 'createCalendar') {
				const summary = this.getNodeParameter('summary', i) as string;
				const admins = this.getNodeParameter('admins', i) as string[];
				const description = this.getNodeParameter('description', i, '') as string;
				const isCorpCalendar = this.getNodeParameter('isCorpCalendar', i, false) as boolean;
				const advancedSettings = this.getNodeParameter('advancedSettings', i, {}) as IDataObject;
				const sharesCollection = this.getNodeParameter('sharesCollection', i, {}) as IDataObject;

				const calendar: IDataObject = {
					summary,
					admins,
				};

				// 全员日历设置
				if (isCorpCalendar) {
					calendar.is_corp_calendar = 1; // 设置为全员日历
				}

				// 日历描述
				if (description) {
					calendar.description = description;
				}

				// 全员日历不支持颜色
				if (!isCorpCalendar) {
					const color = this.getNodeParameter('color', i, '') as string;
					if (color) {
						calendar.color = color;
					}
				}

				// 公开范围
				if (advancedSettings.publicRange) {
					const publicRange = advancedSettings.publicRange as IDataObject;
					const rangeObj: IDataObject = {};
					if (publicRange.userids && (publicRange.userids as string[]).length > 0) {
						rangeObj.userids = publicRange.userids as string[];
					}
					if (publicRange.partyids && (publicRange.partyids as string[]).length > 0) {
						rangeObj.partyids = publicRange.partyids as string[];
					}
					if (Object.keys(rangeObj).length > 0) {
						calendar.public_range = rangeObj;
					}
				}

				// 构建共享范围
				if (sharesCollection.shares) {
					const sharesList = sharesCollection.shares as IDataObject[];
					const shares: IDataObject[] = [];
					sharesList.forEach((s) => {
						const share: IDataObject = { userid: s.userid as string };
						if (s.permission) {
							share.permission = s.permission as number;
						}
						shares.push(share);
					});
					calendar.shares = shares;
				}

				const body: IDataObject = { calendar };
				if (advancedSettings.agentid) {
					body.agentid = advancedSettings.agentid as number;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/add', body);
			} else if (operation === 'updateCalendar') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;
				const summary = this.getNodeParameter('summary', i, '') as string;
				const description = this.getNodeParameter('description', i, '') as string;
				const color = this.getNodeParameter('color', i) as string;
				const publicRange = this.getNodeParameter('publicRange', i, {}) as IDataObject;
				const sharesCollection = this.getNodeParameter('sharesCollection', i, {}) as IDataObject;

				const calendar: IDataObject = { cal_id };

				// 日历设置
				if (summary) {
					calendar.summary = summary;
				}
				if (description) {
					calendar.description = description;
				}
				if (color) {
					calendar.color = color;
				}

				// 公开范围
				if (publicRange && Object.keys(publicRange).length > 0) {
					const rangeObj: IDataObject = {};
					if (publicRange.userids && (publicRange.userids as string[]).length > 0) {
						rangeObj.userids = publicRange.userids as string[];
					}
					if (publicRange.partyids && (publicRange.partyids as string[]).length > 0) {
						rangeObj.partyids = publicRange.partyids as string[];
					}
					if (Object.keys(rangeObj).length > 0) {
						calendar.public_range = rangeObj;
					}
				}

				// 共享范围
				if (sharesCollection.shares) {
					const sharesList = sharesCollection.shares as IDataObject[];
					const shares: IDataObject[] = [];
					sharesList.forEach((s) => {
						const share: IDataObject = { userid: s.userid as string };
						if (s.permission) {
							share.permission = s.permission as number;
						}
						shares.push(share);
					});
					calendar.shares = shares;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/update', {
					calendar,
				});
			} else if (operation === 'getCalendar') {
				const cal_id_list = this.getNodeParameter('cal_id_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/get', {
					cal_id_list: cal_id_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'deleteCalendar') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/calendar/del', {
					cal_id,
				});
			}
			// 管理日程
			else if (operation === 'createSchedule') {
				const adminsCollection = this.getNodeParameter('adminsCollection', i, {}) as IDataObject;
				const summary = this.getNodeParameter('summary', i) as string;
				const start_time = this.getNodeParameter('start_time', i) as number;
				const end_time = this.getNodeParameter('end_time', i) as number;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;
				const description = this.getNodeParameter('description', i, '') as string;
				const location = this.getNodeParameter('location', i, '') as string;
				const cal_id = this.getNodeParameter('cal_id', i, '') as string;
				const agentid = this.getNodeParameter('agentid', i, 0) as number;

				const schedule: IDataObject = {
					summary,
					start_time,
					end_time,
				};

				// 构建管理员列表
				if (adminsCollection.admins) {
					const adminsList = adminsCollection.admins as IDataObject[];
					schedule.admins = adminsList.map((a) => a.userid);
				}

				// 构建参与者列表
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					schedule.attendees = attendeesList.map((a) => ({ userid: a.userid }));
				}

				if (description) schedule.description = description;
				if (location) schedule.location = location;
				if (cal_id) schedule.cal_id = cal_id;

				const body: IDataObject = { schedule };
				if (agentid) body.agentid = agentid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add', body);
			} else if (operation === 'updateSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;
				const skip_attendees = this.getNodeParameter('skip_attendees', i, false) as boolean;
				const op_mode = this.getNodeParameter('op_mode', i, 0) as number;
				const op_start_time = this.getNodeParameter('op_start_time', i, 0) as number;

				let parsedSchedule;
				try {
					parsedSchedule = JSON.parse(schedule);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`schedule 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				const body: IDataObject = {
					schedule: {
						schedule_id,
						...parsedSchedule,
					},
				};

				if (skip_attendees) {
					body.skip_attendees = skip_attendees ? 1 : 0;
				}
				if (op_mode !== 0) {
					body.op_mode = op_mode;
				}
				if (op_start_time > 0 && (op_mode === 1 || op_mode === 2)) {
					body.op_start_time = op_start_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', body);
			} else if (operation === 'updateRecurringSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const schedule = this.getNodeParameter('schedule', i) as string;
				const skip_attendees = this.getNodeParameter('skip_attendees', i, false) as boolean;
				const op_mode = this.getNodeParameter('op_mode', i, 1) as number;
				const op_start_time = this.getNodeParameter('op_start_time', i, 0) as number;

				let parsedSchedule;
				try {
					parsedSchedule = JSON.parse(schedule);
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`schedule 必须是有效的 JSON: ${error.message}`,
						{ itemIndex: i },
					);
				}

				const body: IDataObject = {
					schedule: {
						schedule_id,
						...parsedSchedule,
					},
				};

				if (skip_attendees) {
					body.skip_attendees = skip_attendees ? 1 : 0;
				}
				if (op_mode !== 0) {
					body.op_mode = op_mode;
				}
				if (op_start_time > 0 && (op_mode === 1 || op_mode === 2)) {
					body.op_start_time = op_start_time;
				}

				// 更新重复日程使用相同的接口，通过op_mode和op_start_time控制
				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/update', body);
			} else if (operation === 'addScheduleAttendees') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;

				const attendees: IDataObject[] = [];
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					attendeesList.forEach((a) => {
						attendees.push({ userid: a.userid });
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/add_attendees', {
					schedule_id,
					attendees,
				});
			} else if (operation === 'deleteScheduleAttendees') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const attendeesCollection = this.getNodeParameter('attendeesCollection', i, {}) as IDataObject;

				const attendees: IDataObject[] = [];
				if (attendeesCollection.attendees) {
					const attendeesList = attendeesCollection.attendees as IDataObject[];
					attendeesList.forEach((a) => {
						attendees.push({ userid: a.userid });
					});
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del_attendees', {
					schedule_id,
					attendees,
				});
			} else if (operation === 'listCalendarSchedules') {
				const cal_id = this.getNodeParameter('cal_id', i) as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get_by_calendar', {
					cal_id,
					offset,
					limit,
				});
			} else if (operation === 'getSchedule') {
				const schedule_id_list = this.getNodeParameter('schedule_id_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/get', {
					schedule_id_list: schedule_id_list.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'cancelSchedule') {
				const schedule_id = this.getNodeParameter('schedule_id', i) as string;
				const op_mode = this.getNodeParameter('op_mode', i, 0) as number;
				const op_start_time = this.getNodeParameter('op_start_time', i, 0) as number;

				const body: IDataObject = {
					schedule_id,
				};

				if (op_mode !== 0) {
					body.op_mode = op_mode;
				}
				if (op_start_time > 0 && (op_mode === 1 || op_mode === 2)) {
					body.op_start_time = op_start_time;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/oa/schedule/del', body);
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

