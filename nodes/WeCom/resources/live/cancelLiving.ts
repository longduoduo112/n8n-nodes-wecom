import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['cancelLiving'] };

export const cancelLivingDescription: INodeProperties[] = [
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
