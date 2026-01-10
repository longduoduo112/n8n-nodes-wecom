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
		hint: '必填。发票列表，报销方在获得用户选择的电子发票标识参数后，可以通过该接口批量查询电子发票的结构化信息',
		description: '发票列表。报销方在获得用户选择的电子发票标识参数后，可以通过该接口批量查询电子发票的结构化信息。返回结果包含发票的详细信息，如发票类型、金额、开票时间、PDF_URL等。<a href="https://developer.work.weixin.qq.com/document/path/90286" target="_blank">官方文档</a>',
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
						hint: '必填。发票ID',
						description: '发票ID。和encrypt_code共同构成一张发票卡券的唯一标识',
						placeholder: 'pXXXXXXXXXXXXXXXX',
					},
					{
						displayName: '加密Code',
						name: 'encrypt_code',
						type: 'string',
						default: '',
						required: true,
						hint: '必填。加密code',
						description: '加密code。和card_id共同构成一张发票卡券的唯一标识',
						placeholder: 'encrypt_code_example',
					},
				],
			},
		],
	},
];
