import type { INodeProperties } from 'n8n-workflow';

// 管理日历
import { createCalendarDescription } from './createCalendar';
import { updateCalendarDescription } from './updateCalendar';
import { getCalendarDescription } from './getCalendar';
import { deleteCalendarDescription } from './deleteCalendar';

// 管理日程
import { createScheduleDescription } from './createSchedule';
import { updateScheduleDescription } from './updateSchedule';
import { updateRecurringScheduleDescription } from './updateRecurringSchedule';
import { addScheduleAttendeesDescription } from './addScheduleAttendees';
import { deleteScheduleAttendeesDescription } from './deleteScheduleAttendees';
import { listCalendarSchedulesDescription } from './listCalendarSchedules';
import { getScheduleDescription } from './getSchedule';
import { cancelScheduleDescription } from './cancelSchedule';

const showOnlyForCalendar = {
	resource: ['calendar'],
};

export const calendarDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForCalendar,
		},
		options: [
			// 日历管理
			{
				name: '[日历管理] 创建日历',
				value: 'createCalendar',
				action: '创建日历',
				description: '创建一个新的日历',
			},
			{
				name: '[日历管理] 更新日历',
				value: 'updateCalendar',
				action: '更新日历',
				description: '更新日历的详细信息',
			},
			{
				name: '[日历管理] 获取日历详情',
				value: 'getCalendar',
				action: '获取日历详情',
				description: '获取指定日历的详细信息',
			},
			{
				name: '[日历管理] 删除日历',
				value: 'deleteCalendar',
				action: '删除日历',
				description: '删除指定的日历',
			},
			// 日程管理
			{
				name: '[日程管理] 创建日程',
				value: 'createSchedule',
				action: '创建日程',
				description: '在日历中创建一个新的日程',
			},
			{
				name: '[日程管理] 更新日程',
				value: 'updateSchedule',
				action: '更新日程',
				description: '更新日程的详细信息',
			},
			{
				name: '[日程管理] 更新重复日程',
				value: 'updateRecurringSchedule',
				action: '更新重复日程',
				description: '更新重复日程的详细信息',
			},
			{
				name: '[日程管理] 新增日程参与者',
				value: 'addScheduleAttendees',
				action: '新增日程参与者',
				description: '向日程中添加参与者',
			},
			{
				name: '[日程管理] 删除日程参与者',
				value: 'deleteScheduleAttendees',
				action: '删除日程参与者',
				description: '从日程中删除参与者',
			},
			{
				name: '[日程管理] 获取日历下的日程列表',
				value: 'listCalendarSchedules',
				action: '获取日程列表',
				description: '获取指定日历下的日程列表',
			},
			{
				name: '[日程管理] 获取日程详情',
				value: 'getSchedule',
				action: '获取日程详情',
				description: '获取指定日程的详细信息',
			},
			{
				name: '[日程管理] 取消日程',
				value: 'cancelSchedule',
				action: '取消日程',
				description: '取消指定的日程',
			},
		],
		default: 'createCalendar',
	},
	...createCalendarDescription,
	...updateCalendarDescription,
	...getCalendarDescription,
	...deleteCalendarDescription,
	...createScheduleDescription,
	...updateScheduleDescription,
	...updateRecurringScheduleDescription,
	...addScheduleAttendeesDescription,
	...deleteScheduleAttendeesDescription,
	...listCalendarSchedulesDescription,
	...getScheduleDescription,
	...cancelScheduleDescription,
];

