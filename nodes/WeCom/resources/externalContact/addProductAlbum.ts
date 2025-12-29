import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addProductAlbum'] };

export const addProductAlbumDescription: INodeProperties[] = [
	{
		displayName: '商品描述',
		name: 'description',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		typeOptions: { rows: 3 },
		description: '商品的描述信息',
		placeholder: '这是一款优质商品...',
	},
	{
		displayName: '商品价格（分）',
		name: 'price',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '商品价格，单位为分',
	},
	{
		displayName: '商品编码',
		name: 'product_sn',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },

		placeholder: 'SKU001',
	},
	{
		displayName: '商品附件类型',
		name: 'attachType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '图片', value: 'image' },
		],
		default: 'image',

	},
	{
		displayName: '商品图片',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加图片',
		typeOptions: { multipleValues: true },
		description: '商品图片列表',
		options: [
			{
				displayName: '图片',
				name: 'attachments',
				values: [
					{
						displayName: '图片Media ID',
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
];
