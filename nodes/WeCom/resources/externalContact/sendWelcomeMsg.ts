import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['sendWelcomeMsg'] };

export const sendWelcomeMsgDescription: INodeProperties[] = [
	{
		displayName: '欢迎语Code',
		name: 'welcome_code',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '通过添加外部联系人事件推送获取的welcome_code，该code有效期为20秒',
		placeholder: 'CODE_FROM_EVENT',
	},
	{
		displayName: '消息内容类型',
		name: 'msgContentType',
		type: 'options',
		displayOptions: { show: showOnly },
		options: [
			{ name: '文本', value: 'text' },
			{ name: '图片', value: 'image' },
			{ name: '链接', value: 'link' },
			{ name: '小程序', value: 'miniprogram' },
			{ name: '无消息', value: 'none' },
		],
		default: 'text',
		description: '欢迎语消息类型',
	},
	{
		displayName: '文本内容',
		name: 'text_content',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['text'] } },
		default: '',
		typeOptions: { rows: 4 },
		description: '欢迎语文本内容',
		placeholder: '你好，欢迎！',
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
];
