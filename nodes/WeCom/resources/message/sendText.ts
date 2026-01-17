import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendText = {
	resource: ['message'],
	operation: ['sendText'],
};

export const sendTextDescription: INodeProperties[] = [
	...getRecipientFields('sendText'),
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		default: '',
		placeholder: '请输入消息内容',
		displayOptions: {
			show: showOnlySendText,
		},
		description:
			'消息内容，最长不超过2048个字节，超过将截断（支持换行、以及A标签，即可打开自定义的网页）。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '安全保密消息',
		name: 'safe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendText,
		},
		description:
			'可选。表示是否是保密消息，0表示否，1表示是，默认0。开启后消息不可转发、复制等。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendText,
		},
		description: '可选。表示是否开启ID转译，0表示否，1表示是，默认0。开启后，消息中的userid会转译为@对应成员。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendText,
		},
		description:
			'可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后在时间间隔内相同内容的消息不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendText,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#文本消息" target="_blank">官方文档</a>',
	},
];

