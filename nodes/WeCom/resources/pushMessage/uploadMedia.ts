import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadMedia = {
	resource: ['pushMessage'],
	operation: ['uploadMedia'],
};

export const uploadMediaDescription: INodeProperties[] = [
	{
		displayName: 'Webhook Key',
		name: 'webhookKey',
		type: 'string',
		displayOptions: {
			show: showOnlyForUploadMedia,
		},
		default: '',
		required: true,
		placeholder: '693a91f6-7xxx-4bc4-97a0-0ec2sifa5aaa',
		description: '群机器人的 webhook key',
		hint: '从 webhook URL 中提取的 key 参数',
	},
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
	{
		displayName: '上传成功后将返回 media_id，该 media_id 仅3天内有效，可用于发送文件或语音消息。文件大小限制：普通文件 ≤ 20M，语音文件 ≤ 2M 且播放时长 ≤ 60s。所有文件必须大于5个字节。',
		name: 'notice',
		type: 'notice',
		displayOptions: {
			show: showOnlyForUploadMedia,
		},
		default: '',
	},
];
