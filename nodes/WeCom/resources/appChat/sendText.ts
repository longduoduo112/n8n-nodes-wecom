import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendText = {
	resource: ['appChat'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。群聊的唯一标识，必须是该应用所创建的群',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: '',
		placeholder: '请输入消息内容',
		required: true,
		description:
			'文本消息内容。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。消息内容，最长不超过2048个字节。支持换行，换行符请用转义过的\\n',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendText,
		},
		default: false,
		description:
			'可选。表示是否是保密消息，0表示否，1表示是，默认0。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '可选。表示是否是保密消息，0表示否，1表示是，默认0',
	},
];
