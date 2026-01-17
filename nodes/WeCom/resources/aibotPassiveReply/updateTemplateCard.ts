import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['updateTemplateCard'],
};

export const updateTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '用户ID列表',
		name: 'userids',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateTemplateCard,
		},
		default: '',
		placeholder: 'USERID1,USERID2',
		description: '要替换模版卡片消息的userid列表。可选。表示要替换模版卡片消息的userid列表，用逗号分隔。若不填，则表示替换当前消息涉及到的所有用户',
	},
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForUpdateTemplateCard,
		},
		default: '',
		required: true,
		description: '要替换的模版卡片结构体（JSON格式）',
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdateTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description: '可选。特殊的该回复场景支持设置反馈信息，替换用户模板会覆盖原先消息的反馈信息。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
