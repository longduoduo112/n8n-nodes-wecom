import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadMedia = {
	resource: ['pushMessage'],
	operation: ['uploadMedia'],
};

export const uploadMediaDescription: INodeProperties[] = [
	{
		displayName: '文件类型',
		name: 'mediaType',
		type: 'options',
		displayOptions: {
			show: showOnlyForUploadMedia,
		},
		options: [
			{
				name: '普通文件',
				value: 'file',
				description: '上传普通文件，文件大小不超过20M',
			},
			{
				name: '语音文件',
				value: 'voice',
				description: '上传语音文件，文件大小不超过2M，播放长度不超过60s，仅支持AMR格式',
			},
		],
		default: 'file',
		required: true,
		description: '要上传的文件类型',
	},
	{
		displayName: '二进制属性',
		name: 'binaryProperty',
		type: 'string',
		displayOptions: {
			show: showOnlyForUploadMedia,
		},
		default: 'data',
		required: true,
		placeholder: 'data',
		description: '包含要上传文件的二进制属性名称',
		hint: '通常使用 "data"，这是 n8n 中默认的二进制数据属性名',
	},
];
