import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['uploadAttachment'] };

export const uploadAttachmentDescription: INodeProperties[] = [
	{
		displayName: '媒体类型（必填）',
		name: 'media_type',
		type: 'options',
		options: [
			{ name: '图片', value: 'image', description: '10MB，支持JPG、PNG格式' },
			{ name: '视频', value: 'video', description: '10MB，支持MP4格式' },
			{ name: '文件', value: 'file', description: '10MB' },
		],
		required: true,
		default: 'image',
		displayOptions: { show: showOnly },
		description: '媒体文件类型。注意：商品图册只支持图片类型；朋友圈只支持图片、视频类型',
	},
	{
		displayName: '附件类型（必填）',
		name: 'attachment_type',
		type: 'options',
		options: [
			{ name: '朋友圈', value: 1, description: '上传的附件用于朋友圈' },
			{ name: '商品图册', value: 2, description: '上传的附件用于商品图册' },
		],
		required: true,
		default: 1,
		displayOptions: { show: showOnly },
		description: '附件类型，不同的附件类型用于不同的场景',
	},
	{
		displayName: '二进制属性名',
		name: 'binaryPropertyName',
		type: 'string',
		required: true,
		default: 'data',
		displayOptions: { show: showOnly },
		description: '包含要上传文件数据的二进制属性名称。文件大小必须大于5个字节，最大10MB',
	},
	{
		displayName: '提示',
		name: 'notice',
		type: 'notice',
		default: '',
		displayOptions: { show: showOnly },
		description: '上传后获取的media_id三天内有效。朋友圈类型图片长边不超过10800像素，短边不超过1080像素；视频时长不超过30秒',
	},
];
