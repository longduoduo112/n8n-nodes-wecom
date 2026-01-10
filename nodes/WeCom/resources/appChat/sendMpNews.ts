import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMpNews = {
	resource: ['appChat'],
	operation: ['sendMpNews'],
};

export const sendMpNewsDescription: INodeProperties[] = [
	{
		displayName: '群聊ID',
		name: 'chatid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendMpNews,
		},
		default: '',
		placeholder: 'mychat001',
		required: true,
		description:
			'群聊的唯一标识。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '必填。群聊的唯一标识，必须是该应用所创建的群',
	},
	{
		displayName: '图文列表',
		name: 'articles',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: showOnlyForSendMpNews,
		},
		default: {},
		placeholder: '添加图文',
		description:
			'图文消息，一个图文消息支持1到8条图文。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		options: [
			{
				name: 'article',
				displayName: '图文',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '地球一小时',
						required: true,
						description:
							'标题，不超过128个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
						hint: '必填。标题，不超过128个字节，超过会自动截断',
					},
					{
						displayName: '缩略图 Media ID',
						name: 'thumb_media_id',
						type: 'string',
						default: '',
						placeholder: 'MEDIA_ID',
						required: true,
						description:
							'图文消息缩略图的media_id，可以通过素材管理接口获得。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
						hint: '必填。图文消息缩略图的media_id，可以通过素材管理接口获得。此处thumb_media_id即上传接口返回的media_id',
					},
					{
						displayName: '内容',
						name: 'content',
						type: 'string',
						typeOptions: {
							rows: 5,
						},
						default: '',
						placeholder: '图文消息的内容，支持html标签',
						required: true,
						description:
							'图文消息的内容，支持html标签，不超过666K个字节。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
						hint: '必填。图文消息的内容，支持html标签，不超过666K个字节',
					},
					{
						displayName: '作者',
						name: 'author',
						type: 'string',
						default: '',
						placeholder: 'Author',
						description:
							'可选。图文消息的作者，不超过64个字节。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
						hint: '可选。图文消息的作者，不超过64个字节',
					},
					{
						displayName: '阅读原文链接',
						name: 'content_source_url',
						type: 'string',
						default: '',
						placeholder: 'https://work.weixin.qq.com',
						description:
							'可选。图文消息点击"阅读原文"之后的页面链接。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
						hint: '可选。图文消息点击"阅读原文"之后的页面链接',
					},
					{
						displayName: '摘要',
						name: 'digest',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						placeholder: '图文消息的描述',
						description:
							'可选。图文消息的描述，不超过512个字节，超过会自动截断。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
						hint: '可选。图文消息的描述，不超过512个字节，超过会自动截断',
					},
				],
			},
		],
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendMpNews,
		},
		default: false,
		description:
			'可选。表示是否是保密消息，0表示否，1表示是，默认0。<a href="https://developer.work.weixin.qq.com/document/path/90248" target="_blank">官方文档</a>',
		hint: '可选。表示是否是保密消息，0表示否，1表示是，默认0',
	},
];
