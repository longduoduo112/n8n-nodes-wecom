import type { INodeProperties } from 'n8n-workflow';

const showOnlyConvertToUserid = {
	resource: ['contact'],
	operation: ['convertToUserid'],
};

export const convertToUseridDescription: INodeProperties[] = [
	{
		displayName: 'OpenID',
		name: 'openid',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'oDjGHs-1yCnGrRovBj2yHij5JAAA',
		displayOptions: {
			show: showOnlyConvertToUserid,
		},
		description: '在使用企业支付之后，返回结果的 openid。该接口主要应用于使用企业支付之后的结果查询。开发者需要知道某个结果事件的openid对应企业微信内成员的信息时，可以通过调用该接口进行转换查询。管理组需对openid对应的企业微信成员有查看权限。<a href="https://developer.work.weixin.qq.com/document/path/90202" target="_blank">官方文档</a>',
		hint: '企业支付返回的 openid',
	},
];

