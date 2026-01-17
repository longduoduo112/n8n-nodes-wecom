import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['renameSpace'] };

export const renameSpaceDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID',
	},
	{
		displayName: '新空间名称',
		name: 'spaceName',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '新的空间名称',
	},
];
