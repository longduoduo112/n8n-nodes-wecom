import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelete = {
	resource: ['contact'],
	operation: ['deleteUser'],
};

export const deleteUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelete,
		},
		default: '',
		placeholder: 'zhangsan',
		description: '成员 UserID，对应管理端的账号。若是绑定了腾讯企业邮，则会同时删除邮箱账号。<a href="https://developer.work.weixin.qq.com/document/path/90198" target="_blank">官方文档</a>',
		hint: '要删除的成员 UserID，删除后不可恢复',
	},
];

