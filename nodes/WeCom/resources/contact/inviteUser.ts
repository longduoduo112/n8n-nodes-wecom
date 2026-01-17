import type { INodeProperties } from 'n8n-workflow';

const showOnlyForInvite = {
	resource: ['contact'],
	operation: ['inviteUser'],
};

export const inviteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID列表',
		name: 'user',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		placeholder: 'UserID1,UserID2,UserID3',
		description: '可选。成员ID列表，最多支持1000个。多个成员ID用逗号分隔。user、party、tag三者不能同时为空。如果部分接收人无权限或不存在，邀请仍然执行，但会返回无效的部分。同一用户只须邀请一次，被邀请的用户如果未安装企业微信，在3天内每天会收到一次通知，最多持续3天。<a href="https://developer.work.weixin.qq.com/document/path/90975" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门ID列表',
		name: 'party',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		placeholder: '1,2,3',
		description: '可选。部门ID列表，最多支持100个。多个部门ID用逗号分隔。user、party、tag三者不能同时为空。<a href="https://developer.work.weixin.qq.com/document/path/90975" target="_blank">官方文档</a>',
	},
	{
		displayName: '标签ID列表',
		name: 'tag',
		type: 'string',
		displayOptions: {
			show: showOnlyForInvite,
		},
		default: '',
		placeholder: '101,102,103',
		description: '可选。标签ID列表，最多支持100个。多个标签ID用逗号分隔。user、party、tag三者不能同时为空。<a href="https://developer.work.weixin.qq.com/document/path/90975" target="_blank">官方文档</a>',
	},
];

