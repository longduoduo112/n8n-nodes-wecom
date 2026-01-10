import type { INodeProperties } from 'n8n-workflow';

/**
 * 获取临时素材参数定义
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90254
 *
 * 获取临时素材文件
 * 注意：素材的media_id仅三天内有效
 */

const showOnlyGetTemp = {
	resource: ['material'],
	operation: ['getTemp'],
};

export const getTempDescription: INodeProperties[] = [
	{
		displayName: '素材ID',
		name: 'media_ID',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyGetTemp,
		},
		hint: '必填。媒体文件id，通过"上传临时素材"或"异步上传临时素材"接口获得。media_id在同一企业内所有应用之间可以共享，有效期只有3天，注意要及时获取',
		description: '临时素材的media_id。通过"上传临时素材"或"异步上传临时素材"接口获得。media_id在同一企业内所有应用之间可以共享，有效期只有3天，注意要及时获取，以免过期。异步上传临时素材获取到的media_id，超过20M需使用Range分块下载，且分块大小不超过20M，否则返回错误码830002。其他media_id，若文件过大则返回错误码830002，需使用Range分块下载，建议分块大小不超过20M。本接口支持断点下载（分块下载），通过在http header里指定Range来分块下载。部分业务场景media_id对应的资源在企业微信后台是加密存储的，如果分片下载，指定下载分片长度只能为16字节的倍数，否则无法进行分片解密。<a href="https://developer.work.weixin.qq.com/document/path/90254" target="_blank">官方文档</a>',
		placeholder: 'MEDIA_ID',
	},
	{
		displayName: '二进制数据属性',
		name: 'binaryProperty',
		type: 'string',
		default: 'data',
		displayOptions: {
			show: showOnlyGetTemp,
		},
		hint: '将下载的素材文件存储到的二进制属性名称',
		description: '将下载的素材文件存储到的二进制属性名称。正确时返回和普通的http下载相同，请根据http头做相应的处理',
		placeholder: 'data',
	},
];
