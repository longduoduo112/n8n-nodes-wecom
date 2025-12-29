import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['addSmartsheetSheet'] };
export const addSmartsheetSheetDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{
		displayName: '子表名称',
		name: 'sheet_title',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '子表的标题名称',
		hint: '子表标题',
	},
	{
		displayName: '子表位置',
		name: 'sheet_index',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: '子表在文档中的位置索引，0表示第一个位置',
		hint: '位置索引（可选）',
	},
];
