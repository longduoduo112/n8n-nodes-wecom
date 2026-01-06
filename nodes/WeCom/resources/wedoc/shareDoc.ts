import type { INodeProperties } from 'n8n-workflow';

const showOnlyForShare = {
	resource: ['wedoc'],
	operation: ['shareDoc'],
};

export const shareDocDescription: INodeProperties[] = [
	{
		displayName: '文档类型',
		name: 'docType',
		type: 'options',
		options: [
			{
				name: '文档/智能表/表格',
				value: 'docid',
			},
			{
				name: '收集表',
				value: 'formid',
			},
		],
		default: 'docid',
		required: true,
		displayOptions: {
			show: showOnlyForShare,
		},
		description: '选择要分享的文档类型',
	},
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForShare,
				docType: ['docid'],
			},
		},
		default: '',
		description: '文档的docid',
		hint: '文档ID',
	},
	{
		displayName: '收集表ID',
		name: 'formid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForShare,
				docType: ['formid'],
			},
		},
		default: '',
		description: '收集表的formid',
		hint: '收集表ID',
	},
];
