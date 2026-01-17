import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['downloadFile'] };

export const downloadFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要下载的文件ID',
	},
];
