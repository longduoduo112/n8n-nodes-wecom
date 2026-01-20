import type { INodeProperties } from 'n8n-workflow';
import { getDialRecordDescription } from './getDialRecord';

const showOnlyForPhone = {
	resource: ['phone'],
};

export const phoneDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForPhone,
		},
		options: [
			{
				name: '[公费电话] 获取公费电话拨打记录',
				value: 'getDialRecord',
				action: '获取公费电话拨打记录',
				description: '获取企业成员的公费电话拨打记录',
			},
		],
		default: 'getDialRecord',
	},
	...getDialRecordDescription,
];
