import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCancel = {
	resource: ['calendar'],
	operation: ['cancelSchedule'],
};

export const cancelScheduleDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCancel,
		},
		default: '',
		description: '要取消的日程唯一标识ID',
	},
	{
		displayName: '操作模式',
		name: 'op_mode',
		type: 'options',
		options: [
			{
				name: '删除所有日程',
				value: 0,
				description: '默认删除所有日程',
			},
			{
				name: '仅删除此日程',
				value: 1,
				description: '仅删除此日程',
			},
			{
				name: '删除本次及后续日程',
				value: 2,
				description: '删除本次及后续日程',
			},
		],
		default: 0,
		displayOptions: {
			show: showOnlyForCancel,
		},
		description: '操作模式。是重复日程时有效。',
	},
	{
		displayName: '操作起始时间',
		name: 'op_start_time',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForCancel,
				op_mode: [1, 2],
			},
		},
		default: 0,
		description: '操作起始时间（Unix时间戳）。',
	},
];

