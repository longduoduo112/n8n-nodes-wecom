import type { INodeProperties } from 'n8n-workflow';

const showOnlyRecallMessage = {
	resource: ['message'],
	operation: ['recallMessage'],
};

export const recallMessageDescription: INodeProperties[] = [
	{
		displayName: '消息ID',
		name: 'msgid',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'vcT8gGc-7dFb4bxT35ONjBDz901sLlXPZw1DAMC_Gc26qRpK-AK5sTJkkb0128t',
		displayOptions: {
			show: showOnlyRecallMessage,
		},
		hint: '只能撤回24小时内通过发送应用消息接口推送的消息，仅可撤回企业微信端的数据，微信插件端的数据不支持撤回',
		description:
			'消息ID。从应用发送消息接口处获得。本接口可以撤回24小时内通过发送应用消息接口推送的消息，仅可撤回企业微信端的数据，微信插件端的数据不支持撤回。<a href="https://developer.work.weixin.qq.com/document/path/94867" target="_blank">官方文档</a>',
	},
];

