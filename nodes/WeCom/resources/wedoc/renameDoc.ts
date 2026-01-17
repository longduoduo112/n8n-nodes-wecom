import type { INodeProperties } from 'n8n-workflow';

const showOnlyForRename = {
	resource: ['wedoc'],
	operation: ['renameDoc'],
};

export const renameDocDescription: INodeProperties[] = [
	{
		displayName: '文档类型',
		name: 'docType',
		type: 'options',
		options: [
			{ name: '文档/智能表/表格', value: 'docid' },
			{ name: '收集表', value: 'formid' },
		],
		default: 'docid',
		displayOptions: {
			show: showOnlyForRename,
		},
		description: '选择要重命名的文档类型',
	},
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForRename,
				docType: ['docid'],
			},
		},
		default: '',
	},
	{
		displayName: '收集表ID',
		name: 'formid',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnlyForRename,
				docType: ['formid'],
			},
		},
		default: '',
	},
	{
		displayName: '新文档名称',
		name: 'new_name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForRename,
		},
		default: '',
		description: '新的文档名称，最多255个字符。',
	},
];
