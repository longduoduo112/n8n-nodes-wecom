import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['invoice'],
	operation: ['updateInvoiceStatus'],
};

export const updateInvoiceStatusDescription: INodeProperties[] = [
	{
		displayName: '发票卡券ID',
		name: 'card_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '必填。发票id',
		description: '发票ID。报销企业和报销服务商可以通过该接口对某一张发票进行锁定、解锁和报销操作。',
		placeholder: 'pXXXXXXXXXXXXXXXX',
	},
	{
		displayName: '加密Code',
		name: 'encrypt_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		hint: '必填。加密code，从接收事件中获取',
		description: '加密code。从接收事件中获取的加密发票code，与card_id一起用于更新发票状态。<a href="https://developer.work.weixin.qq.com/document/path/90284" target="_blank">官方文档</a>',
		placeholder: 'encrypt_code_example',
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
				description: '发票已锁定，无法重复提交报销。电子发票进入了企业的报销流程时应该执行锁定操作，执行锁定操作后的电子发票仍然会存在于用户卡包内，但无法重复提交报销',
			},
			{
				name: '发票已核销',
				value: 'INVOICE_REIMBURSE_CLOSURE',
				description: '发票已核销，从用户卡包中移除。当电子发票报销完成后，应该使用本接口执行报销操作。执行报销操作后的电子发票将从用户的卡包中移除，用户可以在卡包的消息中查看到电子发票的核销信息。注意，报销为不可逆操作，请开发者慎重调用',
			},
		],
		required: true,
		default: 'INVOICE_REIMBURSE_INIT',
		displayOptions: {
			show: showOnly,
		},
		hint: '必填。发票报销状态：INVOICE_REIMBURSE_INIT-发票初始状态（未锁定），INVOICE_REIMBURSE_LOCK-发票已锁定，INVOICE_REIMBURSE_CLOSURE-发票已核销',
		description: '发票报销状态。各操作的业务含义：锁定-电子发票进入了企业的报销流程时应该执行锁定操作，执行锁定操作后的电子发票仍然会存在于用户卡包内，但无法重复提交报销；解锁-当电子发票由于各种原因，无法完成报销流程时，应执行解锁操作，执行锁定操作后的电子发票将恢复可以被提交的状态；报销-当电子发票报销完成后，应该使用本接口执行报销操作，执行报销操作后的电子发票将从用户的卡包中移除，用户可以在卡包的消息中查看到电子发票的核销信息。注意，报销为不可逆操作，请开发者慎重调用。<a href="https://developer.work.weixin.qq.com/document/path/90284" target="_blank">官方文档</a>',
	},
];

