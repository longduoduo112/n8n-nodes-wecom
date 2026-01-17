import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['updateMeetingInvitees'] };

export const updateMeetingInviteesDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要更新受邀成员的会议唯一标识ID',
	},
	{
		displayName: '添加成员',
		name: 'addInviteesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加受邀成员',
		typeOptions: { multipleValues: true },
		description: '要添加的受邀成员',
		options: [
			{
				displayName: '成员',
				name: 'invitees',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '要添加的成员UserID',
					},
				],
			},
		],
	},
	{
		displayName: '删除成员',
		name: 'delInviteesCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '删除受邀成员',
		typeOptions: { multipleValues: true },
		description: '要删除的受邀成员',
		options: [
			{
				displayName: '成员',
				name: 'invitees',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '要删除的成员UserID',
					},
				],
			},
		],
	},
];
