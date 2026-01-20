import type { INodeProperties } from 'n8n-workflow';
import { getAppChatDescription } from './getAppChat';
import { createAppChatDescription } from './createAppChat';
import { updateAppChatDescription } from './updateAppChat';
import { sendTextDescription } from './sendText';
import { sendImageDescription } from './sendImage';
import { sendVoiceDescription } from './sendVoice';
import { sendVideoDescription } from './sendVideo';
import { sendFileDescription } from './sendFile';
import { sendTextCardDescription } from './sendTextCard';
import { sendMarkdownDescription } from './sendMarkdown';
import { sendNewsDescription } from './sendNews';
import { sendMpNewsDescription } from './sendMpNews';

const showOnlyForAppChat = {
	resource: ['appChat'],
};

export const appChatDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAppChat,
		},
		options: [
			// 群聊管理
			{
				name: '[群聊管理] 创建群聊会话',
				value: 'createAppChat',
				action: '创建群聊会话',
				description: '创建一个新的群聊会话',
			},
			{
				name: '[群聊管理] 获取群聊会话',
				value: 'getAppChat',
				action: '获取群聊会话',
				description: '通过chatid获取群聊会话信息',
			},
			{
				name: '[群聊管理] 修改群聊会话',
				value: 'updateAppChat',
				action: '修改群聊会话',
				description: '修改群聊会话的信息（群名、群主、成员）',
			},
			// 消息发送
			{
				name: '[消息发送] 发送文本消息',
				value: 'sendText',
				action: '发送文本消息',
				description: '向群聊会话发送文本消息',
			},
			{
				name: '[消息发送] 发送图片消息',
				value: 'sendImage',
				action: '发送图片消息',
				description: '向群聊会话发送图片消息',
			},
			{
				name: '[消息发送] 发送语音消息',
				value: 'sendVoice',
				action: '发送语音消息',
				description: '向群聊会话发送语音消息',
			},
			{
				name: '[消息发送] 发送视频消息',
				value: 'sendVideo',
				action: '发送视频消息',
				description: '向群聊会话发送视频消息',
			},
			{
				name: '[消息发送] 发送文件消息',
				value: 'sendFile',
				action: '发送文件消息',
				description: '向群聊会话发送文件消息',
			},
			{
				name: '[消息发送] 发送文本卡片消息',
				value: 'sendTextCard',
				action: '发送文本卡片消息',
				description: '向群聊会话发送文本卡片消息',
			},
			{
				name: '[消息发送] 发送 Markdown 消息',
				value: 'sendMarkdown',
				action: '发送 Markdown 消息',
				description: '向群聊会话发送 Markdown 格式消息',
			},
			{
				name: '[消息发送] 发送图文消息',
				value: 'sendNews',
				action: '发送图文消息',
				description: '向群聊会话发送图文消息',
			},
			{
				name: '[消息发送] 发送图文消息 (mpnews)',
				value: 'sendMpNews',
				action: '发送图文消息 mpnews',
				description: '向群聊会话发送图文消息（内容存储在企业微信）',
			},
		],
		default: 'getAppChat',
	},
	...getAppChatDescription,
	...createAppChatDescription,
	...updateAppChatDescription,
	...sendTextDescription,
	...sendImageDescription,
	...sendVoiceDescription,
	...sendVideoDescription,
	...sendFileDescription,
	...sendTextCardDescription,
	...sendMarkdownDescription,
	...sendNewsDescription,
	...sendMpNewsDescription,
];

