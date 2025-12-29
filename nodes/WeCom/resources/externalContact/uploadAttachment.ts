import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['uploadAttachment'] };

export const uploadAttachmentDescription: INodeProperties[] = [
	{
		displayName: '媒体类型',
		name: 'media_type',
		type: 'options',
		options: [
			{ name: '图片', value: 'image' },
			{ name: '视频', value: 'video' },
			{ name: '文件', value: 'file' },
		],
		required: true,
		default: 'image',
		displayOptions: { show: showOnly },

	},
	{
		displayName: '附件类型',
		name: 'attachment_type',
		type: 'options',
		options: [
			{ name: '朋友圈', value: 1, description: '上传的附件用于朋友圈' },
			{ name: '商品图册', value: 2, description: '上传的附件用于商品图册' },
		],
		required: true,
		default: 1,
		displayOptions: { show: showOnly },
		description: '附件类型，1-朋友圈，2-商品图册',
	},
	{
		displayName: '附件来源',
		name: 'attachmentSource',
		type: 'options',
		options: [
			{ name: '二进制数据', value: 'binary', description: '从节点输入的二进制数据上传' },
			{ name: 'Media ID', value: 'mediaId', description: '使用已有的media_id' },
		],
		default: 'mediaId',
		displayOptions: { show: showOnly },
		description: '附件数据来源',
	},
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: { show: { ...showOnly, attachmentSource: ['mediaId'] } },
		default: '',
		description: '已有的media_id',
	},
	{
		displayName: '二进制属性名',
		name: 'binaryPropertyName',
		type: 'string',
		displayOptions: { show: { ...showOnly, attachmentSource: ['binary'] } },
		default: 'data',
		description: '包含文件数据的二进制属性名称',
	},
];
