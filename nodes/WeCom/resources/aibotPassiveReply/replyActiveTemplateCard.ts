import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyActiveTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['activeReply'],
	replyType: ['template_card'],
};

export const replyActiveTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyActiveTemplateCard,
		},
		default: '',
		required: true,
		description: '模板卡片结构体（JSON格式）',
		hint: '必填。模板卡片结构体（JSON格式），支持以下类型：\n- text_notice：文本通知模版卡片（card_action必填）\n- news_notice：图文展示模版卡片（main_title和card_action必填，card_image和image_text_area至少填一个）\n- button_interaction：按钮交互模版卡片（main_title、button_list、task_id必填，需要设置回调URL）\n- vote_interaction：投票选择模版卡片（main_title、checkbox、submit_button、task_id必填，需要设置回调URL）\n- multiple_interaction：多项选择模版卡片（main_title、select_list、submit_button必填，需要设置回调URL）\n\n重要提示：\n- 当且仅当回调的会话类型为单聊的时候，支持该主动回复类型\n- 群聊中智能机器人主动回复消息的时候会引用触发回调的用户消息/被点击模板卡片消息\n- 模板卡片消息不支持引用，会默认生成一条空消息进行引用\n\n主要字段说明：\n- card_type：模版类型（必填）\n- source：卡片来源样式（可选）\n- main_title：主要内容（title、desc）\n- task_id：任务id（当有action_menu或交互功能时必填）\n\n详细结构体说明请参考官方文档',
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyActiveTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		hint: '可选。特殊的该回复场景支持设置反馈信息。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
