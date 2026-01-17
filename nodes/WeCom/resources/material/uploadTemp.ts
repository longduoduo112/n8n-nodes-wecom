import type { INodeProperties } from 'n8n-workflow';

/**
 * 上传临时素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90253
 *
 * 素材上传得到media_id，该media_id仅三天内有效
 * media_id在同一企业内应用之间可以共享
 */

const showOnlyUploadTemp = {
	resource: ['material'],
	operation: ['uploadTemp'],
};

export const uploadTempDescription: INodeProperties[] = [
	{
		displayName: '素材类型',
		name: 'type',
		type: 'options',
		options: [
			{
				name: '图片',
				value: 'image',
				description: '图片文件，10MB，支持JPG、PNG格式',
			},
			{
				name: '语音',
				value: 'voice',
				description: '语音文件，2MB，播放长度不超过60s，仅支持AMR格式',
			},
			{
				name: '视频',
				value: 'video',
				description: '视频文件，10MB，支持MP4格式',
			},
			{
				name: '文件',
				value: 'file',
				description: '普通文件，20MB',
			},
		],
		default: 'image',
		required: true,
		displayOptions: {
			show: showOnlyUploadTemp,
		},
		description: '媒体文件类型。素材上传得到media_id，该media_id仅三天内有效，media_id在同一企业内应用之间可以共享。<a href="https://developer.work.weixin.qq.com/document/path/90253" target="_blank">官方文档</a>',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showOnlyUploadTemp,
		},
		description: '要上传的二进制文件属性名称。POST的请求包中，form-data中媒体文件标识，应包含有filename、filelength、content-type等信息。filename标识文件展示的名称，使用该media_id发消息时，展示的文件名由该字段控制',
		placeholder: 'data',
	},
];
