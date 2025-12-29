import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['fileShareSettings'] };

export const fileShareSettingsDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件的ID',
		hint: '文件ID',
	},
	{
		displayName: '分享范围',
		name: 'shareScope',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		default: 1,
		options: [
			{ name: '仅指定成员可访问', value: 1 },
			{ name: '企业内获得链接的人可访问', value: 2 },
			{ name: '获得链接的任何人可访问', value: 3 },
		],
		description: '文件的分享范围',
	},
	{
		displayName: '权限范围',
		name: 'authScope',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		default: 1,
		options: [
			{ name: '可下载', value: 1 },
			{ name: '可预览', value: 2 },
			{ name: '可编辑', value: 3 },
		],
		description: '访问者的权限级别',
	},
];
