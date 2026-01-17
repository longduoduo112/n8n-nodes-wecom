import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
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
			show: showOnlyForUpdate,
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
			show: showOnlyForUpdate,
		},
		default: '{\n  "start_time": 1577836800,\n  "end_time": 1577840400,\n  "summary": "会议主题"\n}',
		description: '要更新的重复日程详情，JSON格式。时间使用秒级Unix时间戳。仅更新提供的字段',
	},
];

