import type { INodeProperties } from 'n8n-workflow';

const showOnlyDeleteMenu = {
	resource: ['agent'],
	operation: ['deleteMenu'],
};

export const deleteMenuDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlyDeleteMenu,
		},
		hint: '企业应用的id',
		description: '企业应用的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90233" target="_blank">官方文档</a>',
	},
];
