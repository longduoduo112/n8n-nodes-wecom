import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['createOnceKey'],
};

export const createOnceKeyDescription: INodeProperties[] = [
	{
		displayName: '获客链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '获客链接id',
	},
	{
		displayName: '生成数量',
		name: 'key_num',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		displayOptions: {
			show: showOnly,
		},
		default: 100,
		description: '生成的代支付key数量，默认100，最大可填写1000',
	},
];
