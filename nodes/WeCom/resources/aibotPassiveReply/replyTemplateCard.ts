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
		hint: '必填。模板卡片结构体（JSON格式），支持以下类型：\n- text_notice：文本通知模版卡片（card_action必填）\n- news_notice：图文展示模版卡片（main_title和card_action必填，card_image和image_text_area至少填一个）\n- button_interaction：按钮交互模版卡片（main_title、button_list、task_id必填，需要设置回调URL）\n- vote_interaction：投票选择模版卡片（main_title、checkbox、submit_button、task_id必填，需要设置回调URL）\n- multiple_interaction：多项选择模版卡片（main_title、select_list、submit_button必填，需要设置回调URL）\n\n主要字段说明：\n- card_type：模版类型（必填）\n- source：卡片来源样式（可选，icon_url、desc、desc_color）\n- action_menu：右上角更多操作按钮（可选，desc、action_list）\n- main_title：主要内容（title、desc）\n- task_id：任务id（当有action_menu或交互功能时必填，最长128字节，只能由数字、字母和"_-@"组成）\n\n详细结构体说明请参考官方文档',
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
		hint: '可选。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
