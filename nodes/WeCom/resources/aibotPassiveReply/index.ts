import type { INodeProperties } from 'n8n-workflow';
import { replyWelcomeTextDescription } from './replyWelcomeText';
import { replyWelcomeTemplateCardDescription } from './replyWelcomeTemplateCard';
import { replyStreamDescription } from './replyStream';
import { replyTemplateCardDescription } from './replyTemplateCard';
import { replyStreamWithTemplateCardDescription } from './replyStreamWithTemplateCard';
import { updateTemplateCardDescription } from './updateTemplateCard';
import { replyMarkdownDescription } from './replyMarkdown';
import { replyActiveTemplateCardDescription } from './replyActiveTemplateCard';

const showOnlyForAIBotPassiveReply = {
	resource: ['aibotPassiveReply'],
};

export const aibotPassiveReplyDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAIBotPassiveReply,
		},
		options: [
			{
				name: '回复欢迎语',
				value: 'replyWelcome',
				action: '回复欢迎语',
				description: '回复进入会话事件的欢迎语',
			},
			{
				name: '回复用户消息',
				value: 'replyMessage',
				action: '回复用户消息',
				description: '回复用户发送的消息',
			},
			{
				name: '更新模板卡片',
				value: 'updateTemplateCard',
				action: '更新模板卡片',
				description: '更新模板卡片消息',
			},
			{
				name: '主动回复消息',
				value: 'activeReply',
				action: '主动回复消息',
				description: '使用response_url主动回复消息（支持markdown、模板卡片）',
			},
		],
		default: 'replyWelcome',
		description: '选择回复操作类型',
		hint: '支持的操作类型：\n- 回复欢迎语：用户当天首次进入单聊会话时回复（被动回复）\n- 回复用户消息：回复用户发送的消息（被动回复，支持流式消息、模板卡片等）\n- 更新模板卡片：更新模板卡片消息（被动回复）\n- 主动回复消息：使用response_url主动回复消息（支持markdown、模板卡片）\n\n注意：\n- 被动回复：在webhook响应中直接回复，需要加密\n- 主动回复：使用response_url主动调用接口回复，明文JSON，每个response_url只能调用一次，有效期1小时',
	},
	{
		displayName: '回复类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['replyWelcome'],
			},
		},
		options: [
			{
				name: '文本消息',
				value: 'text',
				description: '回复文本消息',
			},
			{
				name: '模板卡片消息',
				value: 'template_card',
				description: '回复模板卡片消息',
			},
		],
		default: 'text',
		required: true,
		description: '选择欢迎语的回复类型',
		hint: '进入会话事件支持回复文本消息或模板卡片消息',
	},
	{
		displayName: '回复类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['replyMessage'],
			},
		},
		options: [
			{
				name: '流式消息',
				value: 'stream',
				description: '回复流式消息',
			},
			{
				name: '模板卡片消息',
				value: 'template_card',
				description: '回复模板卡片消息',
			},
			{
				name: '流式消息+模板卡片',
				value: 'stream_with_template_card',
				description: '同时回复流式消息和模板卡片',
			},
		],
		default: 'stream',
		required: true,
		description: '选择回复用户消息的类型',
		hint: '支持回复流式消息、模板卡片消息，或同时回复流式消息和模板卡片',
	},
	{
		displayName: '回复类型',
		name: 'replyType',
		type: 'options',
		displayOptions: {
			show: {
				...showOnlyForAIBotPassiveReply,
				operation: ['activeReply'],
			},
		},
		options: [
			{
				name: 'Markdown消息',
				value: 'markdown',
				description: '回复Markdown消息',
			},
			{
				name: '模板卡片消息',
				value: 'template_card',
				description: '回复模板卡片消息（仅单聊支持）',
			},
		],
		default: 'markdown',
		required: true,
		description: '选择主动回复的消息类型',
		hint: '支持的消息类型：\n- Markdown消息：支持常见的markdown格式\n- 模板卡片消息：仅单聊支持，群聊中会引用触发回调的消息',
	},
	...replyWelcomeTextDescription,
	...replyWelcomeTemplateCardDescription,
	...replyStreamDescription,
	...replyTemplateCardDescription,
	...replyStreamWithTemplateCardDescription,
	...updateTemplateCardDescription,
	...replyMarkdownDescription,
	...replyActiveTemplateCardDescription,
];
