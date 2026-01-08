import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetWorkbenchTemplate = {
	resource: ['agent'],
	operation: ['getWorkbenchTemplate'],
};

export const getWorkbenchTemplateDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlyGetWorkbenchTemplate,
		},
		description: '企业应用的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/92535" target="_blank">官方文档</a>',
	},
];
