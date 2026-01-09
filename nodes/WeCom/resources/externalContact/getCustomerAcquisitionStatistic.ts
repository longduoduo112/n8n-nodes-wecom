import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionStatistic'],
};

export const getCustomerAcquisitionStatisticDescription: INodeProperties[] = [
	{
		displayName: '获客链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '获客链接的ID',
		placeholder: 'caxxxxxxx',
	},
	{
		displayName: '统计起始时间',
		name: 'start_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '统计起始时间戳（Unix时间戳）。注意：仅可查询最近180天内的使用记录',
	},
	{
		displayName: '统计结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '统计结束时间戳（Unix时间戳）。注意：起始和结束时间相差不可超过30天',
	},
];
