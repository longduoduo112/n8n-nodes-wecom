import type { INodeProperties } from 'n8n-workflow';
import { uploadTempDescription } from './uploadTemp';
import { getTempDescription } from './getTemp';
import { uploadImageDescription } from './uploadImage';
import { getHighQualityVoiceDescription } from './getHighQualityVoice';
import { uploadTempAsyncDescription } from './uploadTempAsync';
import { getUploadByUrlResultDescription } from './getUploadByUrlResult';

const showOnlyForMaterial = {
	resource: ['material'],
};

export const materialDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForMaterial,
		},
		options: [
			{ name: '上传临时素材', value: 'uploadTemp', action: '上传临时素材', description: '上传临时素材（图片、语音、视频、文件），使用multipart/form-data POST上传文件。素材上传得到media_id，该media_id仅三天内有效，media_id在同一企业内应用之间可以共享。所有文件size必须大于5个字节' },
			{ name: '上传图片', value: 'uploadImage', action: '上传图片', description: '上传图片素材获取URL（永久有效），使用multipart/form-data POST上传文件。返回的图片URL仅能用于图文消息正文中的图片展示，或者给客户发送欢迎语等；若用于非企业微信环境下的页面，图片将被屏蔽。每个企业每月最多可上传3000张图片，每天最多可上传1000张图片。图片文件大小应在5B~2MB之间' },
			{ name: '获取临时素材', value: 'getTemp', action: '获取临时素材', description: '下载已上传的临时素材文件。media_id在同一企业内所有应用之间可以共享，有效期只有3天。支持断点下载（分块下载），大文件建议使用Range分块下载，分块大小不超过20M。异步上传临时素材获取到的media_id，超过20M需使用Range分块下载' },
			{ name: '获取高清语音素材', value: 'getHighQualityVoice', action: '获取高清语音素材', description: '下载高清语音素材文件（speex格式，16K采样率）。可以使用本接口获取从JSSDK的uploadVoice接口上传的临时语音素材，该音频比临时素材获取接口（格式为amr，8K采样率）更加清晰，适合用作语音识别等对音质要求较高的业务。仅企业微信2.4及以上版本支持。暂时不支持鸿蒙系统上传的语音。media_id在同一企业内所有应用之间可以共享' },
			{ name: '异步上传临时素材', value: 'uploadTempAsync', action: '异步上传临时素材', description: '通过CDN URL异步上传大文件（最高支持200MB），返回jobid。为了满足临时素材的大文件诉求，支持指定文件的CDN链接（必须支持Range分块下载），由企业微信后台异步下载和处理。跟普通临时素材一样，media_id仅三天内有效，media_id在同一企业内应用之间可以共享。目前仅支持场景值1（客户联系入群欢迎语素材），支持video（200MB，MP4格式）和file（200MB）两种类型，所有文件size必须大于5个字节。需要客户联系权限' },
			{ name: '查询异步任务结果', value: 'getUploadByUrlResult', action: '查询异步任务结果', description: '通过jobid查询异步上传任务的结果。任务状态：1-处理中，2-完成，3-异常失败。当status为2时返回media_id（3天内有效）和created_at。任务完成时也会回调通知到应用配置的回调地址。需要客户联系权限' },
		],
		default: 'uploadTemp',
	},
	...uploadTempDescription,
	...getTempDescription,
	...uploadImageDescription,
	...getHighQualityVoiceDescription,
	...uploadTempAsyncDescription,
	...getUploadByUrlResultDescription,
];

