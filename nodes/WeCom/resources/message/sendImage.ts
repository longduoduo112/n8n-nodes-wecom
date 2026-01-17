import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlySendImage = {
	resource: ['message'],
	operation: ['sendImage'],
};

export const sendImageDescription: INodeProperties[] = [
	...getRecipientFields('sendImage'),
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		default: '',
		required: true,
		placeholder: '请输入图片的Media ID',
		displayOptions: {
			show: showOnlySendImage,
		},
		description:
			'图片媒体文件ID，可以通过素材管理接口上传图片获取。<a href="https://developer.work.weixin.qq.com/document/path/90236#图片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '保密消息',
		name: 'safe',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendImage,
		},
		description:
			'表示是否是保密消息，0表示可对外分享，1表示不能分享且内容显示水印，默认为0。开启后消息不可转发、复制等。<a href="https://developer.work.weixin.qq.com/document/path/90236#图片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlySendImage,
		},
		description:
			'表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后在时间间隔内相同内容的消息不会重复发送。<a href="https://developer.work.weixin.qq.com/document/path/90236#图片消息" target="_blank">官方文档</a>',
	},
	{
		displayName: '重复消息检查间隔（秒）',
		name: 'duplicate_check_interval',
		type: 'number',
		default: 1800,
		displayOptions: {
			show: {
				...showOnlySendImage,
				enable_duplicate_check: [true],
			},
		},
		typeOptions: {
			minValue: 0,
			maxValue: 14400,
		},
		description:
			'表示重复消息检查的时间间隔，默认1800秒，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/90236#图片消息" target="_blank">官方文档</a>',
	},
];

