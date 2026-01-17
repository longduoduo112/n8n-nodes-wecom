import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendVoice = {
	resource: ['pushMessage'],
	operation: ['sendVoice'],
};

export const sendVoiceDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendVoice,
		},
		default: '',
		required: true,
		placeholder: '请输入语音文件的 media_id...',
		description: '语音文件的 media_id，通过素材管理接口上传语音文件获得。需先上传语音文件获取 media_id，格式支持 AMR 或 SILK，文件大小不超过2M。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E8%AF%AD%E9%9F%B3%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
];

