import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addMsgTemplate'] };

export const addMsgTemplateDescription: INodeProperties[] = [
	{
		displayName: '群发任务类型',
		name: 'chat_type',
		type: 'options',
		options: [
			{ name: '单聊', value: 'single', description: '发送给客户个人' },
			{ name: '群聊', value: 'group', description: '发送到客户群' },
		],
		default: 'single',
		displayOptions: { show: showOnly },
		description: '群发任务的类型',
	},
	{
		displayName: '发送范围',
		name: 'senderCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '设置发送范围',
		description: '指定群发的成员范围',
		options: [
			{
				displayName: '发送成员',
				name: 'senders',
				values: [
					{
						displayName: '成员UserID列表',
						name: 'sender_list',
						type: 'string',
						default: '',
						description: '发送成员的UserID列表，用逗号分隔',
						placeholder: 'zhangsan,lisi',
					},
				],
			},
		],
	},
	{
		displayName: '消息内容类型',
		name: 'msgContentType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '文本', value: 'text' },
			{ name: '图片', value: 'image' },
			{ name: '链接', value: 'link' },
			{ name: '小程序', value: 'miniprogram' },
		],
		default: 'text',

	},
	{
		displayName: '文本内容',
		name: 'text_content',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['text'] } },
		default: '',
		typeOptions: { rows: 4 },
		description: '文本消息内容',
		placeholder: '亲爱的客户，感谢您的支持...',
	},
	{
		displayName: '图片Media ID',
		name: 'image_media_id',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['image'] } },
		default: '',
		description: '图片的media_id',
	},
	{
		displayName: '链接标题',
		name: 'link_title',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['link'] } },
		default: '',

	},
	{
		displayName: '链接封面URL',
		name: 'link_picurl',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['link'] } },
		default: '',
		description: '链接封面图URL',
	},
	{
		displayName: '链接描述',
		name: 'link_desc',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['link'] } },
		default: '',

	},
	{
		displayName: '链接URL',
		name: 'link_url',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['link'] } },
		default: '',
		description: '链接跳转URL',
	},
	{
		displayName: '小程序标题',
		name: 'miniprogram_title',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['miniprogram'] } },
		default: '',

	},
	{
		displayName: '小程序AppID',
		name: 'miniprogram_appid',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['miniprogram'] } },
		default: '',
		description: '小程序的AppID',
	},
	{
		displayName: '小程序页面路径',
		name: 'miniprogram_pagepath',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['miniprogram'] } },
		default: '',

	},
	{
		displayName: '小程序封面Media ID',
		name: 'miniprogram_pic_media_id',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['miniprogram'] } },
		default: '',
		description: '小程序封面图的media_id',
	},
	{
		displayName: '是否允许成员在待发送客户列表中重新进行选择',
		name: 'allow_select',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },

	},
];
