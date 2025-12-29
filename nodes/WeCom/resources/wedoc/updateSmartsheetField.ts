import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['updateSmartsheetField'] };
export const updateSmartsheetFieldDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{
		displayName: '字段列表',
		name: 'fieldsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要更新的字段',
		typeOptions: { multipleValues: true },
		description: '要更新的字段列表',
		options: [
			{
				displayName: '字段',
				name: 'fields',
				values: [
					{
						displayName: '字段ID',
						name: 'field_id',
						type: 'string',
						default: '',
						required: true,
						description: '要更新的字段ID',
					},
					{
						displayName: '新字段名称',
						name: 'field_title',
						type: 'string',
						default: '',
						description: '新的字段名称，留空则不修改',
					},
					{
						displayName: '选项列表（单选/多选）',
						name: 'select_options',
						type: 'string',
						default: '',
						description: '新的选项列表，多个选项用英文逗号分隔。仅对单选/多选字段有效。',
						placeholder: '例如: 选项1,选项2,选项3',
					},
				],
			},
		],
	},
];
