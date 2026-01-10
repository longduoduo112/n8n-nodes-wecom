import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessageText = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
	msgtype: ['text'],
};

export const sendSchoolMessageTextDescription: INodeProperties[] = [
	{
		displayName: '消息内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForSendSchoolMessageText,
		},
		default: '',
		placeholder: '请输入消息内容',
		required: true,
		description: '消息内容，最长不超过2048个字节（支持ID转译）',
	},
	{
		displayName: '开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessageText,
		},
		default: false,
		description: '可选。表示是否开启ID转译，0表示否，1表示是，默认0。开启后可以将userid/部门ID转成对应的企业通讯录内部的用户名/部门名',
	},
];
