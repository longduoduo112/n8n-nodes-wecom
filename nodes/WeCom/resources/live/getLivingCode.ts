import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['getLivingCode'] };

export const getLivingCodeDescription: INodeProperties[] = [
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'oxxxxxxxxxxxx',
	},
	{
		displayName: '直播ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'livingid',
	},
];
