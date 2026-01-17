import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddServicer = {
	resource: ['kf'],
	operation: ['addServicer'],
};

export const addServicerDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '',
		description: '客服账号的唯一标识ID。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>.',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '接待人员列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddServicer,
		},
		default: '',
		description: '要添加的接待人员UserID列表，多个用英文逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/94646" target="_blank">官方文档</a>',
		placeholder: 'zhangsan,lisi',
	},
];

