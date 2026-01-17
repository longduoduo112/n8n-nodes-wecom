import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddTagUsers = {
	resource: ['contact'],
	operation: ['addTagUsers'],
};

export const addTagUsersDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		placeholder: '12',
		description: '标签ID。调用的应用必须是指定标签的创建者；成员属于应用的可见范围。注意，每个标签下部门数和人员数总和不能超过3万个。<a href="https://developer.work.weixin.qq.com/document/path/90214" target="_blank">官方文档</a>',
	},
	{
		displayName: 'UserID列表',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		placeholder: 'user1,user2',
		description: '可选。企业成员ID列表，注意：userlist、partylist不能同时为空，单次请求个数不超过1000。多个成员ID用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/90214" target="_blank">官方文档</a>',
	},
	{
		displayName: '部门ID列表',
		name: 'partylist',
		type: 'string',
		displayOptions: {
			show: showOnlyForAddTagUsers,
		},
		default: '',
		placeholder: '4',
		description: '可选。企业部门ID列表，注意：userlist、partylist不能同时为空，单次请求个数不超过100。多个部门ID用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/90214" target="_blank">官方文档</a>',
	},
];

