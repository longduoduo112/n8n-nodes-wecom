import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetSheet'] };
export const updateSmartsheetSheetDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '新子表名称',
		name: 'sheet_title',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '新的子表标题名称，留空则不修改',
	},
];
