import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelTagUsers = {
	resource: ['contact'],
	operation: ['delTagUsers'],
};

export const delTagUsersDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		default: '',
		placeholder: '12',
		description: '标签ID。调用的应用必须是指定标签的创建者；成员属于应用的可见范围。<a href="https://developer.work.weixin.qq.com/document/path/90215" target="_blank">官方文档</a>',
		hint: '要删除成员的标签 ID',
	},
	{
		displayName: 'UserID列表',
		name: 'userlist',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		default: '',
		placeholder: 'user1,user2',
		description: '可选。企业成员ID列表，注意：userlist、partylist不能同时为空，单次请求长度不超过1000。多个成员ID用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/90215" target="_blank">官方文档</a>',
		hint: '成员ID列表，用逗号分隔，最多1000个',
	},
	{
		displayName: '部门ID列表',
		name: 'partylist',
		type: 'string',
		displayOptions: {
			show: showOnlyForDelTagUsers,
		},
		default: '',
		placeholder: '2,4',
		description: '可选。企业部门ID列表，注意：userlist、partylist不能同时为空，单次请求长度不超过100。多个部门ID用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/90215" target="_blank">官方文档</a>',
		hint: '部门ID列表，用逗号分隔，最多100个',
	},
];

