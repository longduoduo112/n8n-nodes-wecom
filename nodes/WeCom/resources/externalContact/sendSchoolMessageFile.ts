import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageFile = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['file'],
};

export const sendSchoolMessageFileDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageFile,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description: '文件ID，可以调用上传临时素材接口获取',
		hint: '必填。文件id，可以调用上传临时素材接口获取',
	},
];
