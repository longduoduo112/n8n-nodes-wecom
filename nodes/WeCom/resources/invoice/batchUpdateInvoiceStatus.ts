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
		description: '用户openid。可用"userid与openid互换接口"获取。发票列表必须全部属于同一个openid。<a href="https://developer.work.weixin.qq.com/document/path/90285" target="_blank">官方文档</a>',
		placeholder: 'oxxxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '发票状态',
		name: 'reimburse_status',
		type: 'options',
		options: [
			{
				name: '发票初始状态（未锁定）',
				value: 'INVOICE_REIMBURSE_INIT',
				description: '发票初始状态，未锁定，可以提交报销',
			},
			{
				name: '发票已锁定',
				value: 'INVOICE_REIMBURSE_LOCK',
				description: '发票已锁定，无法重复提交报销。电子发票进入了企业的报销流程时应该执行锁定操作',
			},
			{
				name: '发票已核销',
				value: 'INVOICE_REIMBURSE_CLOSURE',
				description: '发票已核销，从用户卡包中移除。当电子发票报销完成后，应该使用本接口执行报销操作。注意，报销状态为不可逆状态，请开发者慎重调用',
			},
		],
		required: true,
		default: 'INVOICE_REIMBURSE_INIT',
		displayOptions: { show: showOnly },
		description: '发票报销状态。发票平台可以通过该接口对某个成员的一批发票进行锁定、解锁和报销操作。注意，报销状态为不可逆状态，请开发者慎重调用。批量更新发票状态接口为事务性操作，如果其中一张发票更新失败，列表中的其它发票状态更新也会无法执行，恢复到接口调用前的状态。<a href="https://developer.work.weixin.qq.com/document/path/90285" target="_blank">官方文档</a>',
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
		description: '发票列表。必须全部属于同一个openid。批量更新发票状态接口为事务性操作，如果其中一张发票更新失败，列表中的其它发票状态更新也会无法执行，恢复到接口调用前的状态',
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
						description: '发票卡券的card_id。和encrypt_code共同构成一张发票卡券的唯一标识',
						placeholder: 'pXXXXXXXXXXXXXXXX',
					},
					{
						displayName: '加密Code',
						name: 'encrypt_code',
						type: 'string',
						default: '',
						required: true,
						description: '发票卡券的加密code。和card_id共同构成一张发票卡券的唯一标识',
						placeholder: 'encrypt_code_example',
					},
				],
			},
		],
	},
];
