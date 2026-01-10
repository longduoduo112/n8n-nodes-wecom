import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetAgent = {
	resource: ['agent'],
	operation: ['getAgent'],
};

export const getAgentDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlyGetAgent,
		},
		hint: '企业应用的唯一标识ID，必填参数',
		description: '企业应用的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90227" target="_blank">官方文档</a>',
	},
];
