import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['contact'], operation: ['batchReplaceUser'] };

export const batchReplaceUserDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_ID',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '上传的csv文件的media_ID，通过素材管理接口上传文件获得',
	},
	{
		displayName: '启用回调',
		name: 'enableCallback',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否配置回调信息',
	},
	{
		displayName: '回调URL',
		name: 'callback_url',
		type: 'string',
		displayOptions: { show: { ...showOnly, enableCallback: [true] } },
		default: '',
		description: '企业应用接收企业微信推送请求的访问协议和地址',
	},
	{
		displayName: '回调Token',
		name: 'callback_token',
		type: 'string',
		typeOptions: { password: true },
		displayOptions: { show: { ...showOnly, enableCallback: [true] } },
		default: '',
		description: '用于生成签名',
	},
	{
		displayName: '回调EncodingAESKey',
		name: 'callback_encodingaeskey',
		type: 'string',
		displayOptions: { show: { ...showOnly, enableCallback: [true] } },
		default: '',
		description: '用于消息体的加密',
	},
];
