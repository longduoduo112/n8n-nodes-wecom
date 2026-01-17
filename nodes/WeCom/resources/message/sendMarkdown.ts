import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendMarkdown = {
	resource: ['message'],
	operation: ['sendMarkdown'],
};

export const sendMarkdownDescription: INodeProperties[] = [
	...getRecipientFields('sendMarkdown'),
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		required: true,
		default: '',
		placeholder: '请输入Markdown格式的消息内容',
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description:
			'Markdown格式的消息内容，最长不超过2048个字节，必须是utf8编码。目前仅支持markdown语法的子集，支持的语法详见官方文档。<a href="https://developer.work.weixin.qq.com/document/path/90236#markdown消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMarkdown,
		},
		description:
			'可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后在时间间隔内相同内容的消息不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#markdown消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendMarkdown,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#markdown消息" target="_blank">官方文档</a>',
	},
];

