import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['getFilePermissions'] };

export const getFilePermissionsDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件的ID',
	},
];
