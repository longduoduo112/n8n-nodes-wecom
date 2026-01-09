import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionLink'],
};

export const getCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '获客链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '获客链接ID，需要是当前应用创建',
		placeholder: 'LINK_ID_AAA',
	},
];
