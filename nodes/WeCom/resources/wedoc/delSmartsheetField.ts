import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['delSmartsheetField'] };
export const delSmartsheetFieldDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id' },
	{
		displayName: '字段ID列表',
		name: 'field_ids',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要删除的字段ID列表，多个用逗号分隔。字段ID列表',
		placeholder: '如: field_001,field_002',
	},
];
