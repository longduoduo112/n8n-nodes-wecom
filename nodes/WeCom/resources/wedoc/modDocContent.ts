import type { INodeProperties } from 'n8n-workflow';

const showOnlyForModContent = {
	resource: ['wedoc'],
	operation: ['modDocContent'],
};

export const modDocContentDescription: INodeProperties[] = [
	{
		displayName: '文档ID',
		name: 'docid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnlyForModContent },
		default: '',
		description: '文档的docid',
		hint: '文档ID',
	},
	{
		displayName: '操作列表',
		name: 'requestsCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnlyForModContent },
		default: {},
		placeholder: '添加操作',
		typeOptions: { multipleValues: true },
		description: '文档编辑操作列表',
		options: [
			{
				displayName: '操作',
				name: 'requests',
				values: [
					{
						displayName: '操作类型',
						name: 'request_type',
						type: 'options',
						default: 'insert_text',
						options: [
							{ name: '插入文本', value: 'insert_text' },
							{ name: '插入段落', value: 'insert_paragraph' },
							{ name: '删除内容', value: 'delete_content' },
							{ name: '替换文本', value: 'replace_text' },
						],
						description: '要执行的操作类型',
					},
					{
						displayName: '插入位置（索引）',
						name: 'location_index',
						type: 'number',
						default: 1,
						displayOptions: { show: { request_type: ['insert_text', 'insert_paragraph'] } },
						description: '在文档中的位置索引（从1开始）',
						hint: '1 表示文档开头',
					},
					{
						displayName: '文本内容',
						name: 'text',
						type: 'string',
						default: '',
						displayOptions: { show: { request_type: ['insert_text'] } },
						description: '要插入的文本内容',
						typeOptions: { rows: 3 },
					},
					{
						displayName: '删除范围（开始）',
						name: 'delete_start',
						type: 'number',
						default: 1,
						displayOptions: { show: { request_type: ['delete_content'] } },
						description: '删除范围的开始位置索引（从1开始）',
					},
					{
						displayName: '删除范围（结束）',
						name: 'delete_end',
						type: 'number',
						default: 1,
						displayOptions: { show: { request_type: ['delete_content'] } },
						description: '删除范围的结束位置索引',
					},
					{
						displayName: '查找文本',
						name: 'search_text',
						type: 'string',
						default: '',
						displayOptions: { show: { request_type: ['replace_text'] } },
						description: '要查找的文本内容',
					},
					{
						displayName: '替换为',
						name: 'replace_text',
						type: 'string',
						default: '',
						displayOptions: { show: { request_type: ['replace_text'] } },
						description: '替换后的文本内容',
					},
					{
						displayName: '全部替换',
						name: 'replace_all',
						type: 'boolean',
						default: true,
						displayOptions: { show: { request_type: ['replace_text'] } },
						description: '是否替换所有匹配项',
					},
				],
			},
		],
	},
];
