import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addGroupWelcomeTemplate'] };

export const addGroupWelcomeTemplateDescription: INodeProperties[] = [
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
		description: '入群欢迎语的消息类型',
	},
	{
		displayName: '文本内容',
		name: 'text_content',
		type: 'string',
		displayOptions: { show: { ...showOnly, msgContentType: ['text'] } },
		default: '',
		typeOptions: { rows: 4 },
		description: '欢迎语文本内容',
		placeholder: '欢迎加入我们的客户群！',
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
		displayName: '适用成员',
		name: 'agentid',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description: '授权方安装的应用agentid，普通企业不需要填写',
	},
	{
		displayName: '是否通知',
		name: 'notify',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否通知成员将这条入群欢迎语应用到客户群中',
	},
];
