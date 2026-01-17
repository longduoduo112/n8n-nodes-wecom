import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyStream = {
	resource: ['aibotPassiveReply'],
	operation: ['replyMessage'],
	replyType: ['stream'],
};

export const replyStreamDescription: INodeProperties[] = [
	{
		displayName: '流式消息ID',
		name: 'stream_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: '',
		placeholder: 'STREAMID',
		description: '自定义的唯一ID，首次回复时必须设置。可选。自定义的唯一ID，首次回复时必须设置。后续回调会根据这个ID来获取最新的流式消息',
	},
	{
		displayName: '是否结束',
		name: 'finish',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: false,
		description: '流式消息是否结束。可选。流式消息是否结束，false表示继续，true表示结束',
	},
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 6,
		},
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: '',
		placeholder: '**广州**今日天气：29度，大部分多云',
		description: '流式消息内容。可选。流式消息内容，最长不超过20480个字节，必须是utf8编码。支持markdown格式。特殊的，第一次回复内容为"1"，第二次回复"123"，则此时消息展示内容"123"',
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
				...showOnlyForReplyStream,
				finish: [true],
			},
		},
		default: {},
		placeholder: '添加图片',
		description: '图文混排消息列表。可选。图文混排消息列表，目前仅支持图片类型。特殊的，目前image的消息类型仅当finish=true，即流式消息结束的最后一次回复中设置。最多支持设置10个',
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
						description: '图片内容的base64编码。必填。图片内容的base64编码。图片（base64编码前）最大不能超过10M，支持JPG、PNG格式',
					},
					{
						displayName: 'MD5值',
						name: 'md5',
						type: 'string',
						default: '',
						placeholder: 'MD5',
						required: true,
						description: '图片内容的md5值。必填。图片内容（base64编码前）的md5值',
					},
				],
			},
		],
	},
	{
		displayName: '反馈ID',
		name: 'feedback_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForReplyStream,
		},
		default: '',
		placeholder: 'FEEDBACKID',
		description: '可选。流式消息首次回复时候若字段不为空值，回复的消息被用户反馈时候会触发回调事件。有效长度为256字节以内，必须是utf-8编码',
	},
];
