import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadAsync = {
	resource: ['material'],
	operation: ['uploadTempAsync'],
};

export const uploadTempAsyncDescription: INodeProperties[] = [
	{
		displayName: '场景值',
		name: 'scene',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '客户联系入群欢迎语素材',
				value: 1,
				description: '目前仅支持此场景',
			},
		],
		default: 1,
		description: '场景值。目前仅支持1-客户联系入群欢迎语素材。每个场景值有对应的使用范围，详见使用场景说明。<a href="https://developer.work.weixin.qq.com/document/path/96219" target="_blank">官方文档</a>',
	},
	{
		displayName: '素材类型',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		options: [
			{
				name: '视频',
				value: 'video',
				description: '视频文件，200MB，仅支持MP4格式',
			},
			{
				name: '文件',
				value: 'file',
				description: '普通文件，200MB',
			},
		],
		default: 'video',
		description: '媒体文件类型。目前仅支持video（视频）和file（普通文件），不超过32字节。视频：200MB，仅支持MP4格式；普通文件：200MB。所有文件size必须大于5个字节',
	},
	{
		displayName: '文件名',
		name: 'filename',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '文件名，标识文件展示的名称。比如，使用该media_id发消息时，展示的文件名由该字段控制。不超过128字节',
		placeholder: 'video.mp4',
	},
	{
		displayName: '文件CDN URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '文件cdn URL。URL要求支持Range分块下载，不超过1024字节。如果为腾讯云cos链接，则需要设置为「公有读」权限',
		placeholder: 'https://example.com/video.mp4',
	},
	{
		displayName: '文件MD5',
		name: 'md5',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAsync,
		},
		default: '',
		description: '文件md5。对比从URL下载下来的文件md5是否一致。不超过32字节',
		placeholder: 'd41d8cd98f00b204e9800998ecf8427e',
	},
];
