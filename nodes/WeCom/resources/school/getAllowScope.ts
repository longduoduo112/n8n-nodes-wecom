import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getAllowScope'],
};

export const getAllowScopeDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: 0,
		description: '应用id',
	},
];
