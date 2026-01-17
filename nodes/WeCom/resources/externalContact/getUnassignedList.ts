import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getUnassignedList'],
};

export const getUnassignedListDescription: INodeProperties[] = [
	{
		displayName: 'Page ID',
		name: 'page_id',
		type: 'number',
		default: 0,
		displayOptions: {
			show: showOnly,
		},
		description: '分页查询，从0开始。分页查询的page_id，第一个为0',
	},
	{
		displayName: '每页数量',
		name: 'page_size',
		type: 'number',
		default: 1000,
		displayOptions: {
			show: showOnly,
		},
		description: '每次返回的最大记录数。每次返回的最大记录数，默认1000，最大1000',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '分页查询游标，字符串类型，由上一次调用返回。分页查询游标',
	},
];

