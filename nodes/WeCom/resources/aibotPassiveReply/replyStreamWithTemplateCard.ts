import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyStreamWithTemplateCard = {
	resource: ['aibotPassiveReply'],
	operation: ['replyMessage'],
	replyType: ['stream_with_template_card'],
};

export const replyStreamWithTemplateCardDescription: INodeProperties[] = [
	{
		displayName: '流式消息ID',
		name: 'stream_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: 'STREAMID',
		required: true,
		description: '自定义的唯一ID，首次回复时必须设置',
		hint: '必填。自定义的唯一id，首次回复时必须设置。后续回调会根据这个id来获取最新的流式消息',
	},
	{
		displayName: '是否结束',
		name: 'finish',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: false,
		description: '流式消息是否结束',
		hint: '可选。流式消息是否结束，false表示继续，true表示结束',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: '**广州**今日天气：29度，大部分多云',
		description: '流式消息内容',
		hint: '可选。流式消息内容，最长不超过20480个字节，必须是utf8编码。支持markdown格式',
	},
	{
		displayName: '图片列表',
		name: 'msg_item',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		displayOptions: {
			show: {
				...showOnlyForReplyStreamWithTemplateCard,
				finish: [true],
			},
		},
		default: {},
		placeholder: '添加图片',
		description: '图文混排消息列表',
		hint: '可选。图文混排消息列表，目前仅支持图片类型。仅当finish=true时支持',
		options: [
			{
				name: 'image',
				displayName: '图片',
				values: [
					{
						displayName: 'Base64编码',
						name: 'base64',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: 'BASE64',
						required: true,
						description: '图片内容的base64编码',
						hint: '必填。图片内容的base64编码。图片（base64编码前）最大不能超过10M，支持JPG、PNG格式',
					},
					{
						displayName: 'MD5值',
						name: 'md5',
						type: 'string',
						default: '',
						placeholder: 'MD5',
						required: true,
						description: '图片内容的md5值',
						hint: '必填。图片内容（base64编码前）的md5值',
					},
				],
			},
		],
	},
	{
		displayName: '流式消息反馈ID',
		name: 'stream_feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		hint: '可选。流式消息首次回复时候若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
	{
		displayName: '模板卡片',
		name: 'template_card',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		description: '模板卡片结构体（JSON格式）',
		hint: '可选。模板卡片结构体（JSON格式），支持以下类型：\n- text_notice：文本通知模版卡片（card_action必填）\n- news_notice：图文展示模版卡片（main_title和card_action必填，card_image和image_text_area至少填一个）\n- button_interaction：按钮交互模版卡片（main_title、button_list、task_id必填，需要设置回调URL）\n- vote_interaction：投票选择模版卡片（main_title、checkbox、submit_button、task_id必填，需要设置回调URL）\n- multiple_interaction：多项选择模版卡片（main_title、select_list、submit_button必填，需要设置回调URL）\n\n重要提示：\n- template_card可首次回复，也可在收到流式消息刷新事件时回复\n- 但是同一个消息只能回复一次\n- 首次回复时必须返回stream的id\n\n主要字段说明：\n- card_type：模版类型（必填）\n- source：卡片来源样式（可选）\n- main_title：主要内容（title、desc）\n- task_id：任务id（当有action_menu或交互功能时必填）\n\n详细结构体说明请参考官方文档',
	},
	{
		displayName: '模板卡片反馈ID',
		name: 'template_card_feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStreamWithTemplateCard,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		hint: '可选。若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
