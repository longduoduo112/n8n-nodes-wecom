import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['deleteFile'] };

export const deleteFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID列表',
		name: 'fileIds',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要删除的文件ID列表，多个用逗号分隔',
		hint: '文件ID列表',
		placeholder: '如: file_001,file_002',
	},
];
