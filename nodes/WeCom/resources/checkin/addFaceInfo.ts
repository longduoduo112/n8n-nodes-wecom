import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddFaceInfo = {
	resource: ['checkin'],
	operation: ['addFaceInfo'],
};

export const addFaceInfoDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddFaceInfo,
		},
		default: '',
		description: '要添加人脸信息的员工UserID',
	},
	{
		displayName: '人脸图片Media ID',
		name: 'mediaid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddFaceInfo,
		},
		default: '',
		description: '人脸图片的MediaID，需要先通过素材管理接口上传',
	},
];

