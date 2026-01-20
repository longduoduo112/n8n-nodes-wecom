import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetUserRules = {
	resource: ['checkin'],
	operation: ['getUserRules'],
};

export const getUserRulesDescription: INodeProperties[] = [
	{
		displayName: '日期时间',
		name: 'datetime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserRules,
		},
		default: 0,
		description: '需要获取规则的日期当天0点的Unix时间戳。<a href="https://developer.work.weixin.qq.com/document/path/94204" target="_blank">官方文档</a>',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetUserRules,
		},
		default: '',
		description: '需要获取打卡规则的用户列表，多个用英文逗号分隔，最多100个。<a href="https://developer.work.weixin.qq.com/document/path/94204" target="_blank">官方文档</a>',
		placeholder: 'james,paul',
	},
];

