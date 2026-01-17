import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['moveFile'] };

export const moveFileDescription: INodeProperties[] = [
	{
		displayName: '文件ID列表',
		name: 'fileIds',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要移动的文件ID列表，多个用逗号分隔',
		placeholder: '如: file_001,file_002',
	},
	{
		displayName: '目标文件夹ID',
		name: 'fatherId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '目标文件夹的ID',
	},
	{
		displayName: '同名时替换',
		name: 'replace',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '目标位置存在同名文件时是否替换',
	},
];
