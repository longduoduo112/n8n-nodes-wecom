import type { INodeProperties } from 'n8n-workflow';

const showOnlyForListKfAccount = {
	resource: ['kf'],
	operation: ['listKfAccount'],
};

export const listKfAccountDescription: INodeProperties[] = [
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		displayOptions: {
			show: showOnlyForListKfAccount,
		},
		default: 50,
		description: '每页返回的记录数量，默认50，最大100。<a href="https://developer.work.weixin.qq.com/document/path/94661" target="_blank">官方文档</a>',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnlyForListKfAccount,
		},
		default: '',
		description: '用于分页查询的游标，首次请求留空，后续请求传入上次返回的next_cursor值。<a href="https://developer.work.weixin.qq.com/document/path/94661" target="_blank">官方文档</a>',
		placeholder: '',
	},
];

