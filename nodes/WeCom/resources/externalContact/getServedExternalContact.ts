import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getServedExternalContact'],
};

export const getServedExternalContactDescription: INodeProperties[] = [
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 1000,
		displayOptions: {
			show: showOnly,
		},
		description: '返回的最大记录数，整型，默认为1000',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标，由上一次调用返回，首次调用可不填。注意：cursor具有有效期（4小时），请勿缓存后使用',
	},
];

