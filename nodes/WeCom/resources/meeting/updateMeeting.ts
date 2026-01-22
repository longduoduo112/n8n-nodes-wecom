import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['meeting'],
	operation: ['updateMeeting'],
};

export const updateMeetingDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '会议的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/99105" target="_blank">官方文档</a>',
		placeholder: '12345678901234567890',
	},
	{
		displayName: '会议主题',
		name: 'subject',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '可选。会议主题，长度限制128个字符。<a href="https://developer.work.weixin.qq.com/document/path/99105" target="_blank">官方文档</a>',
		placeholder: '产品需求评审会（已调整）',
	},
	{
		displayName: '会议开始时间',
		name: 'start_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '可选。会议开始时间，秒级Unix时间戳。<a href="https://developer.work.weixin.qq.com/document/path/99105" target="_blank">官方文档</a>',
	},
	{
		displayName: '会议结束时间',
		name: 'end_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '可选。会议结束时间，秒级Unix时间戳。必须大于开始时间。<a href="https://developer.work.weixin.qq.com/document/path/99105" target="_blank">官方文档</a>',
	},
];

