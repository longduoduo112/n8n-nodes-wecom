import type { INodeProperties } from 'n8n-workflow';

export const getVipListDescription: INodeProperties[] = [
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getVipList'],
			},
		},
		default: '',
		description: '用于分页查询的游标，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '限制条数',
		name: 'limit',
		type: 'number',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getVipList'],
			},
		},
		default: 100,
		description: '每次请求返回的数据上限，默认100，最大200',
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
	},
];
