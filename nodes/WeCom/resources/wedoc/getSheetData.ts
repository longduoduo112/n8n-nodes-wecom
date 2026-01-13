import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getSheetData'] };
export const getSheetDataDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'在线表格唯一标识。注意：此接口仅支持普通在线表格（spreadsheet），不支持智能表格（smartsheet）。如果您的文档是智能表格，请使用"查询记录"操作',
		hint: '在线表格ID',
	},
	{
		displayName: '工作表ID',
		name: 'sheet_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '工作表ID，工作表的唯一标识',
		hint: '工作表ID',
	},
	{
		displayName: '范围',
		name: 'range',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description:
			'查询的范围，格式遵循 A1表示法（如"A1:B2"）。限制：行数≤1000，列数≤200，总单元格≤10000',
		hint: '数据范围',
	},
];
