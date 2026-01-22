import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['updateAdvancedMeeting'] };

export const updateAdvancedMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要更新的高级会议唯一标识ID',
	},
	{
		displayName: '会议主题',
		name: 'subject',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的会议主题，留空则不修改',
	},
	{
		displayName: '会议开始时间',
		name: 'start_time',
		type: 'dateTime',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的开始时间（Unix时间戳秒），留空表示不修改',
	},
	{
		displayName: '会议结束时间',
		name: 'end_time',
		type: 'dateTime',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的结束时间（Unix时间戳秒），留空表示不修改',
	},
	{
		displayName: '高级设置',
		name: 'advancedSettings',
		type: 'collection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加高级设置',
		options: [
			{
				displayName: '会议描述',
				name: 'description',
				type: 'string',
				default: '',
				description: '新的会议描述信息',
			},
			{
				displayName: '会议密码',
				name: 'password',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: '新的会议密码',
			},
		],
	},
];
