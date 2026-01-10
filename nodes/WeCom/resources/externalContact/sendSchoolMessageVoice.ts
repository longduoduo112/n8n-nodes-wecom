import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageVoice = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['voice'],
};

export const sendSchoolMessageVoiceDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageVoice,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description: '语音文件ID，可以调用上传临时素材接口获取',
		hint: '必填。语音文件id，可以调用上传临时素材接口获取',
	},
];
