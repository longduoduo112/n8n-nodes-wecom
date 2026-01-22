import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateRecurring = {
	resource: ['calendar'],
	operation: ['updateRecurringSchedule'],
};

export const updateRecurringScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateRecurring,
		},
		default: '',
		description: '要更新的重复日程唯一标识ID',
	},
	{
		displayName: '日程详情',
		name: 'schedule',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateRecurring,
		},
		default: '{\n  "start_time": 1577836800,\n  "end_time": 1577840400,\n  "summary": "会议主题"\n}',
		description: '要更新的重复日程详情，JSON格式。时间使用秒级Unix时间戳。仅更新提供的字段',
	},
	{
		displayName: '跳过参与者更新',
		name: 'skip_attendees',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForUpdateRecurring,
		},
		description: '是否不更新参与人。默认为否',
	},
	{
		displayName: '操作模式',
		name: 'op_mode',
		type: 'options',
		options: [
			{
				name: '全部修改',
				value: 0,
				description: '默认全部修改',
			},
			{
				name: '仅修改此日程',
				value: 1,
				description: '仅修改此日程',
			},
			{
				name: '修改将来的所有日程',
				value: 2,
				description: '修改将来的所有日程',
			},
		],
		default: 1,
		displayOptions: {
			show: showOnlyForUpdateRecurring,
		},
		description: '操作模式。是重复日程时有效。',
	},
	{
		displayName: '操作起始时间',
		name: 'op_start_time',
		type: 'dateTime',
		displayOptions: {
			show: {
				...showOnlyForUpdateRecurring,
				op_mode: [1, 2],
			},
		},
		default: '',
		description: '操作起始时间。仅当操作模式是"仅修改此日程"或"修改将来的所有日程"时有效',
	},
];

