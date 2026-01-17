import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetByEmail = {
	resource: ['contact'],
	operation: ['getUserIdByEmail'],
};

export const getUserIdByEmailDescription: INodeProperties[] = [
	{
		displayName: '邮箱',
		name: 'email',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetByEmail,
		},
		placeholder: '12345@qq.com',
		default: '',
		description: '邮箱地址。请确保邮箱的正确性，若出错的次数超过企业人数上限的20%，会导致1天不可调用。注意：已升级openid的代开发或第三方，获取的是密文userid。<a href="https://developer.work.weixin.qq.com/document/path/95895" target="_blank">官方文档</a>',
	},
	{
		displayName: '邮箱类型',
		name: 'email_type',
		type: 'options',
		displayOptions: {
			show: showOnlyForGetByEmail,
		},
		options: [
			{
				name: '企业邮箱',
				value: 1,
			},
			{
				name: '个人邮箱',
				value: 2,
			},
		],
		default: 1,
		description: '可选。邮箱类型：1-企业邮箱（默认）；2-个人邮箱。<a href="https://developer.work.weixin.qq.com/document/path/95895" target="_blank">官方文档</a>',
	},
];

