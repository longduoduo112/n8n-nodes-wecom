import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetCustomerInfo = {
	resource: ['kf'],
	operation: ['getCustomerInfo'],
};

export const getCustomerInfoDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomerInfo,
		},
		default: '',
		description: '客服账号的唯一标识ID，格式为wkxxxx开头的字符串。<a href="https://developer.work.weixin.qq.com/document/path/95159" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '外部联系人ID',
		name: 'external_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetCustomerInfo,
		},
		default: '',
		description: '客户的外部联系人UserID，格式为wmxxxx开头的字符串，可从客服消息、事件推送或其他接口中获取。<a href="https://developer.work.weixin.qq.com/document/path/95159" target="_blank">官方文档</a>',
		placeholder: 'wmxxxxxxxxxxxxxxxxxx',
	},
];

