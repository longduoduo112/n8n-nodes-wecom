import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['renameFile'] };

export const renameFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件或文件夹的ID',
	},
	{
		displayName: '新名称',
		name: 'newName',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '新的文件或文件夹名称',
	},
];
