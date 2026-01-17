import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendMarkdown = {
	resource: ['pushMessage'],
	operation: ['sendMarkdown'],
};

export const sendMarkdownDescription: INodeProperties[] = [
	{
		displayName: 'Markdown 内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 8,
		},
		displayOptions: {
			show: showOnlyForSendMarkdown,
		},
		default: '',
		required: true,
		placeholder: '# 标题\n\n**加粗文本**\n\n[链接文本](https://example.com)',
		description: 'Markdown 格式的消息内容，目前仅支持md的子集，最长不超过4096个字节。支持标题、加粗、斜体、链接、图片、引用、代码等 Markdown 语法。<a href="https://developer.work.weixin.qq.com/document/path/99110#markdown%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
];

