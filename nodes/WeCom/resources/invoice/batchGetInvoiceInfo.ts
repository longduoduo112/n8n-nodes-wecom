import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['invoice'], operation: ['batchGetInvoiceInfo'] };

export const batchGetInvoiceInfoDescription: INodeProperties[] = [
	{
		displayName: '发票列表',
		name: 'itemCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加发票',
		typeOptions: { multipleValues: true },
		description: '发票项列表，最多支持100张发票',
		options: [
			{
				displayName: '发票',
				name: 'items',
				values: [
					{
						displayName: '发票卡券ID',
						name: 'card_id',
						type: 'string',
						default: '',
						required: true,
						description: '发票卡券的card_id',
						placeholder: 'pXXXXXXXXXXXXXXXX',
					},
					{
						displayName: '加密Code',
						name: 'encrypt_code',
						type: 'string',
						default: '',
						required: true,
						description: '加密的发票code',
						placeholder: 'encrypt_code_example',
					},
				],
			},
		],
	},
];
