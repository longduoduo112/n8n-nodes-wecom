import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['contact'], operation: ['batchReplaceDepartment'] };

export const batchReplaceDepartmentDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'xxxxxx',
		description: '上传的csv文件的media_id，通过素材管理接口上传文件获得。CSV文件的media_id，需先通过素材管理接口上传',
	},
	{
		displayName: '启用回调',
		name: 'enableCallback',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否配置回调信息。如填写该项则任务完成后，通过callback推送事件给企业。具体请参考应用回调模式中的相应选项。<a href="https://developer.work.weixin.qq.com/document/path/90982" target="_blank">官方文档</a>',
	},
	{
		displayName: '回调URL',
		name: 'callback_url',
		type: 'string',
		displayOptions: { show: { ...showOnly, enableCallback: [true] } },
		default: '',
		placeholder: 'https://example.com/callback',
		description: '可选。企业应用接收企业微信推送请求的访问协议和地址，支持http或https协议。<a href="https://developer.work.weixin.qq.com/document/path/90982" target="_blank">官方文档</a>',
	},
	{
		displayName: '回调Token',
		name: 'callback_token',
		type: 'string',
		typeOptions: { password: true },
		displayOptions: { show: { ...showOnly, enableCallback: [true] } },
		default: '',
		description: '可选。用于生成签名。<a href="https://developer.work.weixin.qq.com/document/path/90982" target="_blank">官方文档</a>',
	},
	{
		displayName: '回调EncodingAESKey',
		name: 'callback_encodingaeskey',
		type: 'string',
		displayOptions: { show: { ...showOnly, enableCallback: [true] } },
		default: '',
		description: '可选。用于消息体的加密，是AES密钥的Base64编码。<a href="https://developer.work.weixin.qq.com/document/path/90982" target="_blank">官方文档</a>',
	},
];
