import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteCustomerAcquisitionLink'],
};

export const deleteCustomerAcquisitionLinkDescription: INodeProperties[] = [
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
];

