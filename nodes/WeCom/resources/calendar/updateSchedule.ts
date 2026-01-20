import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['calendar'],
	operation: ['updateSchedule'],
};

export const updateScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日程的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/93649" target="_blank">官方文档</a>',
		placeholder: '17c7d2bd-8062-4d73-b2e1-e4e8b8f8c7c8',
	},
	{
		displayName: '日程详情',
		name: 'schedule',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '{\n  "start_time": 1577836800,\n  "end_time": 1577840400,\n  "summary": "周例会（已调整）"\n}',
		description: '要更新的日程详情，JSON格式。时间使用秒级Unix时间戳。仅更新提供的字段，未提供的字段保持不变。<a href="https://developer.work.weixin.qq.com/document/path/93649" target="_blank">官方文档</a>',
	},
	{
		displayName: '跳过参与者更新',
		name: 'skip_attendees',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		description: '是否不更新参与人。0-否；1-是。默认为0',
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
		default: 0,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		description: '操作模式。是重复日程时有效。',
	},
	{
		displayName: '操作起始时间',
		name: 'op_start_time',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForUpdate,
				op_mode: [1, 2],
			},
		},
		default: 0,
		description: '操作起始时间（Unix时间戳）。',
	},
];

