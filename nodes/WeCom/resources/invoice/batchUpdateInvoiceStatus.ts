import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['invoice'], operation: ['batchUpdateInvoiceStatus'] };

export const batchUpdateInvoiceStatusDescription: INodeProperties[] = [
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '用户的openid',
		placeholder: 'oxxxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '发票状态',
		name: 'reimburse_status',
		type: 'options',
		options: [
			{ name: '发票已锁定', value: 'INVOICE_REIMBURSE_INIT', description: '发票初始状态，已锁定待报销' },
			{ name: '发票已核销', value: 'INVOICE_REIMBURSE_LOCK', description: '发票已被核销，不可重复使用' },
			{ name: '发票已完成报销', value: 'INVOICE_REIMBURSE_CLOSURE', description: '发票已完成报销流程' },
		],
		required: true,
		default: 'INVOICE_REIMBURSE_INIT',
		displayOptions: { show: showOnly },
		description: '发票报销状态',
	},
	{
		displayName: '发票列表',
		name: 'invoiceCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加发票',
		typeOptions: { multipleValues: true },
		description: '发票列表，最多支持100张发票',
		options: [
			{
				displayName: '发票',
				name: 'invoices',
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
