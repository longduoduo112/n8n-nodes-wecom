import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['listContactWay'],
};

export const listContactWayDescription: INodeProperties[] = [
	{
		displayName: '创建起始时间',
		name: 'start_time',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description: '「联系我」创建起始时间戳（秒），默认为90天前。注意：该接口仅可获取2021年7月10日以后创建的「联系我」',
		placeholder: '1622476800',
	},
	{
		displayName: '创建结束时间',
		name: 'end_time',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description: '「联系我」创建结束时间戳（秒），默认为当前时间',
		placeholder: '1625068800',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '分页查询使用的游标，为上次请求返回的next_cursor',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 100,
		displayOptions: { show: showOnly },
		description: '每次查询的分页大小，默认为100条，最多支持1000条',
	},
];
