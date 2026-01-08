import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['getLivingShareInfo'] };

export const getLivingShareInfoDescription: INodeProperties[] = [
	{
		displayName: '直播ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'livingid',
	},
	{
		displayName: '分享类型',
		name: 'wwshare',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '微信分享链接', value: 0 },
			{ name: '企业微信分享链接', value: 1 },
		],
		default: 0,
		description: '是否获取企业微信分享链接',
	},
];
