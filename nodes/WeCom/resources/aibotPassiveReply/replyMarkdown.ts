import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyMarkdown = {
	resource: ['aibotPassiveReply'],
	operation: ['activeReply'],
	replyType: ['markdown'],
};

export const replyMarkdownDescription: INodeProperties[] = [
	{
		displayName: 'Markdown内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyMarkdown,
		},
		default: '',
		placeholder: '# 标题\n## 二级标题\n**加粗**\n*斜体*',
		required: true,
		description: 'Markdown消息内容',
		hint: '必填。消息内容，最长不超过20480个字节，必须是utf8编码。支持常见的markdown格式：\n- 标题（#、##、###）\n- 字体（*斜体*、**加粗**）\n- 列表（有序、无序）\n- 引用（>）\n- 链接（[文本](URL)）\n- 图片（![alt](URL)）\n- 分割线（---）\n- 代码（`行内代码`、```代码块```）\n- 表格（| 列1 | 列2 |）',
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyMarkdown,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		hint: '可选。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
