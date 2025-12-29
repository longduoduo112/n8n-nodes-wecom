import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['createFolder'] };

export const createFolderDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID',
		hint: '空间ID',
	},
	{
		displayName: '文件夹名称',
		name: 'folderName',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '新建文件夹的名称',
		hint: '文件夹名称',
	},
	{
		displayName: '父文件夹ID',
		name: 'fatherId',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '父文件夹的ID，不填则在空间根目录创建',
		hint: '父文件夹ID（可选）',
	},
];
