import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['mail'], operation: ['sendMail'] };

export const sendMailDescription: INodeProperties[] = [
	{
		displayName: '发件人邮箱',
		name: 'sender',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'user@example.com',
		description: '发件人的企业邮箱地址',
	},
	{
		displayName: '邮件主题',
		name: 'subject',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: '邮件主题',
		description: '邮件的主题',
	},
	{
		displayName: '收件人',
		name: 'toListCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加收件人',
		typeOptions: { multipleValues: true },
		description: '收件人邮箱列表',
		options: [
			{
				displayName: '收件人',
				name: 'recipients',
				values: [
					{
						displayName: '邮箱地址',
						name: 'email',
						type: 'string',
						default: '',
						required: true,
						placeholder: 'recipient@example.com',
						description: '收件人邮箱地址',
					},
				],
			},
		],
	},
	{
		displayName: '抄送',
		name: 'ccListCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加抄送人',
		typeOptions: { multipleValues: true },
		description: '抄送人邮箱列表（可选）',
		options: [
			{
				displayName: '抄送人',
				name: 'recipients',
				values: [
					{
						displayName: '邮箱地址',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'cc@example.com',
						description: '抄送人邮箱地址',
					},
				],
			},
		],
	},
	{
		displayName: '密送',
		name: 'bccListCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加密送人',
		typeOptions: { multipleValues: true },
		description: '密送人邮箱列表（可选）',
		options: [
			{
				displayName: '密送人',
				name: 'recipients',
				values: [
					{
						displayName: '邮箱地址',
						name: 'email',
						type: 'string',
						default: '',
						placeholder: 'bcc@example.com',
						description: '密送人邮箱地址',
					},
				],
			},
		],
	},
	{
		displayName: '正文格式',
		name: 'contentType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '纯文本', value: 1, description: '纯文本格式' },
			{ name: 'HTML', value: 2, description: 'HTML富文本格式' },
		],
		default: 1,
		description: '邮件正文的格式类型',
	},
	{
		displayName: '邮件正文',
		name: 'content',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		typeOptions: { rows: 6 },
		description: '邮件正文内容',
		placeholder: '请输入邮件正文...',
	},
	{
		displayName: '附件',
		name: 'attachmentCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加附件',
		typeOptions: { multipleValues: true },
		description: '附件列表，附件需要先通过上传接口获取media_id（可选）',
		options: [
			{
				displayName: '附件',
				name: 'attachments',
				values: [
					{
						displayName: '附件类型',
						name: 'type',
						type: 'options',
						default: 1,
						options: [
							{ name: '普通附件', value: 1 },
							{ name: '云附件', value: 2 },
						],

					},
					{
						displayName: 'Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						required: true,
						description: '通过上传接口获取的media_id',
					},
				],
			},
		],
	},
];
