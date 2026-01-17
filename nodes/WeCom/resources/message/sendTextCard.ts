import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendTextCard = {
	resource: ['message'],
	operation: ['sendTextCard'],
};

export const sendTextCardDescription: INodeProperties[] = [
	...getRecipientFields('sendTextCard'),
	{
		displayName: '卡片标题',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		placeholder: '请输入卡片标题',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description:
			'标题，不超过128个字符，超过会自动截断（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '卡片描述',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		placeholder: '请输入卡片描述内容',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description:
			'描述，不超过512个字符，超过会自动截断（支持ID转译）。支持使用br标签或者空格来进行换行处理，也支持使用div标签来使用不同的字体颜色（gray/highlight/normal）。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '跳转链接',
		name: 'url',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://example.com',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description:
			'点击后跳转的链接。最长2048字节，请确保包含了协议头(http/https)。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '按钮文字',
		name: 'btntxt',
		type: 'string',
		default: '详情',
		placeholder: '详情',
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description:
			'可选。按钮文字。默认为"详情"，不超过4个文字，超过自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '可选。表示是否开启ID转译，0表示否，1表示是，默认0。开启后会将消息中的userid转为@对应成员显示。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendTextCard,
		},
		description: '可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后相同内容的消息在时间间隔内不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendTextCard,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本卡片消息" target="_blank">官方文档</a>',
	},
];

