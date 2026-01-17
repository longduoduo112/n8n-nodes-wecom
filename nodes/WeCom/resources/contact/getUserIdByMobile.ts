import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetByMobile = {
	resource: ['contact'],
	operation: ['getUserIdByMobile'],
};

export const getUserIdByMobileDescription: INodeProperties[] = [
	{
		displayName: '手机号',
		name: 'mobile',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetByMobile,
		},
		default: '',
		placeholder: '13430388888',
		description: '用户在企业微信通讯录中的手机号码。长度为5~32个字节。请确保手机号的正确性，若出错的次数超出企业人数上限的20%，会导致1天不可调用。注意：第三方应用获取的值是密文的userid。<a href="https://developer.work.weixin.qq.com/document/path/95402" target="_blank">官方文档</a>',
	},
];

