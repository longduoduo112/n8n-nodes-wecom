import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageMiniprogram = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['miniprogram'],
};

export const sendSchoolMessageMiniprogramDescription: INodeProperties[] = [
	{
		displayName: '小程序AppID',
		name: 'appid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageMiniprogram,
		},
		default: '',
		placeholder: 'APPID',
		required: true,
		description:
			'小程序appid，必须是关联到企业的小程序应用。必填。小程序appid，必须是关联到企业的小程序应用',
	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageMiniprogram,
		},
		default: '',
		placeholder: '欢迎报名夏令营',
		description: '可选。小程序消息标题，最多64个字节，超过会自动截断（支持ID转译）。可选。小程序消息标题，最多64个字节，超过会自动截断，支持ID转译',
	},
	{
		displayName: '封面Media ID',
		name: 'thumb_media_id',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageMiniprogram,
		},
		default: '',
		placeholder: 'MEDIA_ID',
		required: true,
		description:
			'小程序消息封面的mediaid，封面图建议尺寸为520*416。必填。小程序消息封面的mediaid，封面图建议尺寸为520*416',
	},
	{
		displayName: '页面路径',
		name: 'pagepath',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessageMiniprogram,
		},
		default: '',
		placeholder: 'PAGE_PATH',
		required: true,
		description:
			'点击消息卡片后进入的小程序页面路径。必填。点击消息卡片后进入的小程序页面路径',
	},
	{
		displayName: '开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessageMiniprogram,
		},
		default: false,
		description: '可选。表示是否开启ID转译，默认否。开启后可以将userid/部门ID转成对应的企业通讯录内部的用户名/部门名',
	},
];
