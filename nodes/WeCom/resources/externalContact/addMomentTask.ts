import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addMomentTask'] };

export const addMomentTaskDescription: INodeProperties[] = [
	{
		displayName: '发表成员',
		name: 'senderCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加发表成员',
		typeOptions: { multipleValues: true },
		description: '可见范围的发表成员列表',
		options: [
			{
				displayName: '成员',
				name: 'senders',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '发表成员的UserID',
					},
				],
			},
		],
	},
	{
		displayName: '朋友圈内容类型',
		name: 'contentType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '文本', value: 'text' },
			{ name: '图片', value: 'image' },
			{ name: '链接', value: 'link' },
		],
		default: 'text',

	},
	{
		displayName: '文本内容',
		name: 'text_content',
		type: 'string',
		displayOptions: { show: { ...showOnly, contentType: ['text', 'image', 'link'] } },
		default: '',
		typeOptions: { rows: 4 },
		description: '朋友圈文本内容',
		placeholder: '今天是个好日子...',
	},
	{
		displayName: '图片Media ID列表',
		name: 'imageCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, contentType: ['image'] } },
		default: {},
		placeholder: '添加图片',
		typeOptions: { multipleValues: true },
		description: '图片的media_id列表，最多9张',
		options: [
			{
				displayName: '图片',
				name: 'images',
				values: [
					{
						displayName: 'Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '图片的media_id',
					},
				],
			},
		],
	},
	{
		displayName: '链接标题',
		name: 'link_title',
		type: 'string',
		displayOptions: { show: { ...showOnly, contentType: ['link'] } },
		default: '',

	},
	{
		displayName: '链接URL',
		name: 'link_url',
		type: 'string',
		displayOptions: { show: { ...showOnly, contentType: ['link'] } },
		default: '',
		description: '链接跳转URL',
	},
	{
		displayName: '链接Media ID',
		name: 'link_media_id',
		type: 'string',
		displayOptions: { show: { ...showOnly, contentType: ['link'] } },
		default: '',
		description: '链接封面图的media_id',
	},
];
