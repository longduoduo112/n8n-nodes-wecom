import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['addSmartsheetRecord'] };
export const addSmartsheetRecordDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '智能表格的docid。', hint: '文档ID' },
	{ displayName: '子表ID', name: 'sheet_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '子表的sheet_id。', hint: '子表ID' },
	{
		displayName: 'Key类型',
		name: 'key_type',
		type: 'options',
		displayOptions: { show: showOnly },
		default: 'CELL_VALUE_KEY_TYPE_FIELD_TITLE',
		options: [
			{ name: '字段标题', value: 'CELL_VALUE_KEY_TYPE_FIELD_TITLE', description: '使用字段标题作为单元格数据的key（推荐）' },
			{ name: '字段ID', value: 'CELL_VALUE_KEY_TYPE_FIELD_ID', description: '使用字段ID作为单元格数据的key' },
		],
		description: '指定记录中字段值的key类型',
	},
	{
		displayName: '记录列表',
		name: 'recordsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加记录',
		typeOptions: { multipleValues: true },
		description: '要添加的记录列表',
		options: [
			{
				displayName: '记录',
				name: 'records',
				values: [
					{
						displayName: '字段值',
						name: 'cellValues',
						type: 'fixedCollection',
						default: {},
						placeholder: '添加字段值',
						typeOptions: { multipleValues: true },
						description: '记录中各字段的值',
						options: [
							{
								displayName: '值',
								name: 'values',
								values: [
									{
										displayName: '字段（ID或标题）',
										name: 'field_key',
										type: 'string',
										default: '',
										required: true,
										description: '字段ID或字段标题（根据上方Key类型设置）',
									},
									{
										displayName: '值类型',
										name: 'value_type',
										type: 'options',
										default: 'text',
										options: [
											{ name: '文本', value: 'text' },
											{ name: '数字', value: 'number' },
											{ name: '链接', value: 'url' },
											{ name: '邮箱', value: 'email' },
											{ name: '布尔值', value: 'checkbox' },
										],
										description: '值的类型',
									},
									{
										displayName: '值',
										name: 'value',
										type: 'string',
										default: '',
										description: '字段的值',
									},
								],
							},
						],
					},
				],
			},
		],
	},
];
