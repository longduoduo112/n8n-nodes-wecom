import type { INodeProperties } from 'n8n-workflow';

/**
 * 获取高清语音素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90255
 *
 * 可以使用本接口获取从JSSDK的uploadVoice接口上传的临时语音素材
 * 格式一般为speex，16kHz或8kHz采样，单声道
 */

const showOnlyForGetVoice = {
	resource: ['material'],
	operation: ['getHighQualityVoice'],
};

export const getHighQualityVoiceDescription: INodeProperties[] = [
	{
		displayName: '素材ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		default: '',
		hint: '必填。通过JSSDK的uploadVoice接口上传的语音文件id。media_id在同一企业内所有应用之间可以共享',
		description: '通过JSSDK的uploadVoice接口上传的语音文件ID。可以使用本接口获取从JSSDK的uploadVoice接口上传的临时语音素材，格式为speex，16K采样率。该音频比临时素材获取接口（格式为amr，8K采样率）更加清晰，适合用作语音识别等对音质要求较高的业务。仅企业微信2.4及以上版本支持。暂时不支持鸿蒙系统上传的语音。media_id在同一企业内所有应用之间可以共享。转码请使用Speex的官方解码库和微信的解码库',
		placeholder: 'MEDIA_ID',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyForGetVoice,
		},
		hint: '将下载的高清语音文件存储到的二进制属性名称',
		description: '将下载的高清语音文件存储到的二进制属性名称。正确时返回和普通的http下载相同，请根据http头做相应的处理。返回格式为speex，16K采样率',
		placeholder: 'data',
	},
];
