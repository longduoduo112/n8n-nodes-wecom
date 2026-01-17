import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendVoice = {
	resource: ['message'],
	operation: ['sendVoice'],
};

export const sendVoiceDescription: INodeProperties[] = [
	...getRecipientFields('sendVoice'),
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		default: '',
		required: true,
		placeholder: '请输入语音的Media ID',
		displayOptions: {
			show: showOnlySendVoice,
		},
		description:
			'语音文件ID，可以通过素材管理接口上传语音获取。<a href="https://developer.work.weixin.qq.com/document/path/90236#语音消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendVoice,
		},
		description:
			'表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后在时间间隔内相同内容的消息不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#语音消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查间隔（秒）',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendVoice,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'表示重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#语音消息" target="_blank">官方文档</a>',
	},
];

