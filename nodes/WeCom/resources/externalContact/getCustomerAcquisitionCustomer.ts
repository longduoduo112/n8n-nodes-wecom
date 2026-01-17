import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionCustomer'],
};

export const getCustomerAcquisitionCustomerDescription: INodeProperties[] = [
	{
		displayName: '链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '获客链接ID。获客链接ID',
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '用于分页查询的游标',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		default: 50,
		displayOptions: {
			show: showOnly,
		},
		description: 'Max number of results to return。返回的最大记录数，整型，最大值1000',
	},
];

