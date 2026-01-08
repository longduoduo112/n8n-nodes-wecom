import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetWorkbenchData = {
	resource: ['agent'],
	operation: ['getWorkbenchData'],
};

export const getWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description: '企业应用的唯一标识',
	},
	{
		displayName: '用户ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyGetWorkbenchData,
		},
		description: '需要获取数据的用户userid。<a href="https://developer.work.weixin.qq.com/document/path/104210" target="_blank">官方文档</a>',
	},
];
