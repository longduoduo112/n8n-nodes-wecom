import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDelServicer = {
	resource: ['kf'],
	operation: ['delServicer'],
};

export const delServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94647" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '接待人员列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDelServicer,
		},
		default: '',
		description: '要删除的接待人员UserID列表，多个用英文逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/94647" target="_blank">官方文档</a>',
		placeholder: 'zhangsan,lisi',
	},
];

