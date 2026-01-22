import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['phone'],
	operation: ['getDialRecord'],
};

export const getDialRecordDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnly,
		},
		description: '查询的起始时间，UTC时间戳，单位为秒。如未指定，则默认查询最近30天范围内数据',
		default: '',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'dateTime',
		displayOptions: {
			show: showOnly,
		},
		description: '查询的结束时间，UTC时间戳，单位为秒。如未指定，则默认查询最近30天范围内数据',
		default: '',
	},
	{
		displayName: '分页偏移量',
		name: 'offset',
		type: 'number',
		noDataExpression: true,
		displayOptions: {
			show: showOnly,
		},
		description: '分页查询的偏移量，默认为0',
		default: 0,
		typeOptions: {
			minValue: 0,
		},
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		noDataExpression: true,
		displayOptions: {
			show: showOnly,
		},
		description: '分页查询的每页大小，默认为100条，如该参数大于100则按100处理',
		default: 100,
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
	},
];
