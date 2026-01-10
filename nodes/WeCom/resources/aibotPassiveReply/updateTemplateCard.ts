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
		description: '要替换模版卡片消息的userid列表',
		hint: '可选。表示要替换模版卡片消息的userid列表，用逗号分隔。若不填，则表示替换当前消息涉及到的所有用户',
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
		hint: '必填。要替换的模版卡片结构体（JSON格式），支持以下类型：\n- text_notice：文本通知模版卡片\n- news_notice：图文展示模版卡片\n- button_interaction：按钮交互模版卡片\n- vote_interaction：投票选择模版卡片\n- multiple_interaction：多项选择模版卡片\n\n重要提示：\n- 模板卡片中的task_id需跟回调收到的task_id一致\n- 更新模版卡片时，可通过disable字段控制选择器是否可选\n- 更新模版卡片会覆盖原先消息的反馈信息（如果设置了feedback.id）\n\n主要字段说明：\n- card_type：模版类型（必填）\n- task_id：任务id（必填，需与回调事件中的task_id一致）\n- checkbox.disable：投票选择框是否不可选（更新时有效）\n- button_selection.disable：下拉选择器是否不可选（更新时有效）\n\n详细结构体说明请参考官方文档',
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
		hint: '可选。特殊的该回复场景支持设置反馈信息，替换用户模板会覆盖原先消息的反馈信息。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
