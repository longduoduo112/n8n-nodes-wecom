import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modDocSafeRule'] };
export const modDocSafeRuleDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid' },
	{
		displayName: '启用水印',
		name: 'watermark_enable',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否启用文档水印',
	},
	{
		displayName: '水印类型',
		name: 'watermark_type',
		type: 'options',
		displayOptions: {
			show: {
				...showOnly,
				watermark_enable: [true],
			},
		},
		default: 1,
		options: [
			{ name: '访问者信息', value: 1, description: '显示访问者姓名等信息' },
			{ name: '自定义文字', value: 2, description: '显示自定义水印文字' },
		],
		description: '水印的类型',
	},
	{
		displayName: '自定义水印文字',
		name: 'watermark_text',
		type: 'string',
		displayOptions: {
			show: {
				...showOnly,
				watermark_enable: [true],
				watermark_type: [2],
			},
		},
		default: '',
		description: '自定义的水印文字内容',
	},
	{
		displayName: '允许下载',
		name: 'allow_download',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: '是否允许下载文档',
	},
	{
		displayName: '允许打印',
		name: 'allow_print',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: '是否允许打印文档',
	},
	{
		displayName: '允许复制',
		name: 'allow_copy',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: '是否允许复制文档内容',
	},
];
