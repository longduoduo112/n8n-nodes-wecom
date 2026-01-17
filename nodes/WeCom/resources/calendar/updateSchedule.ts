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
];

