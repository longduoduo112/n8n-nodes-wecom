import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['updateProductAlbum'] };

export const updateProductAlbumDescription: INodeProperties[] = [
	{
		displayName: '商品ID',
		name: 'product_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '要更新的商品ID',
	},
	{
		displayName: '商品描述',
		name: 'description',
		type: 'string',
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
		displayName: '更新商品图片',
		name: 'updateAttachments',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否更新商品图片',
	},
	{
		displayName: '商品图片',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, updateAttachments: [true] } },
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
