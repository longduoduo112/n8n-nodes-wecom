import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['getMeetingRecords'] };

export const getMeetingRecordsDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议唯一标识ID',
	},
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		displayOptions: { show: showOnly },
		default: '',
		description: '查询开始时间（Unix时间戳秒），留空表示不限制',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		displayOptions: { show: showOnly },
		default: '',
		description: '查询结束时间（Unix时间戳秒），留空表示不限制',
	},
];
