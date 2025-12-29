import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['meeting'], operation: ['removeMember'] };

export const removeMemberDescription: INodeProperties[] = [
	{
		displayName: '会议ID',
		name: 'meetingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '会议唯一标识ID',
		hint: '会议ID',
	},
	{
		displayName: '移除成员',
		name: 'membersCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要移除的成员',
		typeOptions: { multipleValues: true },
		description: '要从会议中移除的成员列表',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '用户ID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '要移除的成员UserID',
					},
				],
			},
		],
	},
];
