import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendMpNews = {
	resource: ['message'],
	operation: ['sendMpNews'],
};

export const sendMpNewsDescription: INodeProperties[] = [
	...getRecipientFields('sendMpNews'),
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		required: true,
		default: {},
		placeholder: '添加图文',
		displayOptions: {
			show: showOnlySendMpNews,
		},
		description:
			'Mpnews类型的图文消息，一个图文消息支持1到8条图文。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
		options: [
			{
				displayName: '图文',
				name: 'article',
				values: [
					{
						displayName: '作者',
						name: 'author',
						type: 'string',
						default: '',
						placeholder: '请输入作者名称',
						description:
							'可选。图文消息的作者，不超过64个字节。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '图文消息的内容',
						name: 'content',
						type: 'string',
						required: true,
						default: '',
						placeholder: '请输入图文内容（支持HTML）',
						description:
							'图文消息的内容，支持html标签，不超过666 K个字节。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '图文消息的描述',
						name: 'digest',
						type: 'string',
						default: '',
						placeholder: '请输入图文摘要',
						description:
							'可选。图文消息的描述，不超过512个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
						placeholder: '请输入图文标题',
						description:
							'标题，不超过128个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '缩略图Media ID',
						name: 'thumb_media_ID',
						type: 'string',
						required: true,
						default: '',
						placeholder: '请输入缩略图的Media ID',
						description:
							'图文消息缩略图的media_ID，可以在上传多媒体文件接口中获得。此处thumb_media_ID即上传接口返回的media_ID。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
					},
					{
						displayName: '阅读原文链接',
						name: 'content_source_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						description:
							'可选。图文消息点击"阅读原文"之后的页面链接。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
					},
				],
			},
		],
	},
	{
		displayName: '安全保密消息',
		name: 'safe',
		type: 'options',
		options: [
			{
				name: '可对外分享',
				value: 0,
			},
			{
				name: '不能分享且内容显示水印',
				value: 1,
			},
			{
				name: '仅限在企业内分享',
				value: 2,
			},
		],
		default: 0,
		displayOptions: {
			show: showOnlySendMpNews,
		},
		hint: '仅mpnews类型的消息支持safe值为2，其他消息类型不支持',
		description: '可选。表示是否是保密消息，0表示可对外分享，1表示不能分享且内容显示水印，2表示仅限在企业内分享，默认为0。注意仅mpnews类型的消息支持safe值为2，其他消息类型不支持。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMpNews,
		},
		hint: '开启后会将消息中的userid转为@对应成员',
		description: '可选。表示是否开启ID转译，0表示否，1表示是，默认0。开启后会将消息中的userid转为@对应成员显示。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendMpNews,
		},
		hint: '开启后在时间间隔内相同内容的消息不会重复发送',
		description: '可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后相同内容的消息在时间间隔内不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendMpNews,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		hint: '默认1800秒，最大不超过4小时（14400秒）',
		description:
			'可选。表示是否重复消息检查的时间间隔，默认1800秒，最大不超过4小时。<a href="https://developer.work.weixin.qq.com/document/path/90236#mpnews消息" target="_blank">官方文档</a>',
	},
];

