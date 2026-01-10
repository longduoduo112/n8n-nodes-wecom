import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendTextCard = {
	resource: ['appChat'],
	operation: ['sendTextCard'],
};

export const sendTextCardDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendTextCard,
		},
		default: '',
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。群聊的唯一标识，必须是该应用所创建的群',
	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendTextCard,
		},
		default: '',
		placeholder: '领奖通知',
		required: true,
		description:
			'标题，不超过128个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。标题，不超过128个字节，超过会自动截断',
	},
	{
		displayName: '描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 5,
		},
		displayOptions: {
			show: showOnlyForSendTextCard,
		},
		default: '',
		placeholder: '<div class="gray">2016年9月26日</div><div class="normal">恭喜你抽中iPhone 7一台</div>',
		required: true,
		description:
			'描述，不超过512个字节，超过会自动截断。支持使用br标签换行，支持div标签设置字体颜色：gray(灰色)、highlight(高亮)、normal(默认黑色)。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。描述，不超过512个字节，超过会自动截断。支持使用br标签或空格换行，支持div标签设置字体颜色：gray(灰色)、highlight(高亮)、normal(默认黑色)',
	},
	{
		displayName: '跳转链接',
		name: 'url',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendTextCard,
		},
		default: '',
		placeholder: 'https://work.weixin.qq.com/',
		required: true,
		description:
			'点击后跳转的链接。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。点击后跳转的链接',
	},
	{
		displayName: '按钮文字',
		name: 'btntxt',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendTextCard,
		},
		default: '详情',
		placeholder: '详情',
		description:
			'可选。按钮文字，默认为"详情"，不超过4个文字，超过自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '可选。按钮文字，默认为"详情"，不超过4个文字，超过自动截断',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendTextCard,
		},
		default: false,
		description:
			'可选。表示是否是保密消息，0表示否，1表示是，默认0。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '可选。表示是否是保密消息，0表示否，1表示是，默认0',
	},
];
