import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['replyMessage'],
	replyType: ['template_card'],
};

export const replyTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyTemplateCard,
		},
		default: '',
		required: true,
		description: '模板卡片结构体（JSON格式）',
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description: '可选。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
