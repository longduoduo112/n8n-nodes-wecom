import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['addSpaceMembers'] };

const authOptions = [
	{ name: '可下载', value: 1, description: '可以下载文件' },
	{ name: '可预览', value: 2, description: '只能预览文件' },
	{ name: '可编辑', value: 3, description: '可以编辑文件' },
	{ name: '可管理', value: 4, description: '管理员权限' },
];

export const addSpaceMembersDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID',
		hint: '空间ID',
	},
	{
		displayName: '成员列表',
		name: 'authInfoCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要添加的成员或部门',
		options: [
			{
				displayName: '成员',
				name: 'members',
				values: [
					{
						displayName: '类型',
						name: 'type',
						type: 'options',
						default: 1,
						options: [
							{ name: '成员', value: 1, description: '企业成员' },
							{ name: '部门', value: 2, description: '企业部门' },
						],
						description: '成员类型',
					},
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						displayOptions: { show: { type: [1] } },
						description: '企业成员的UserID',
					},
					{
						displayName: '部门ID',
						name: 'departmentid',
						type: 'number',
						default: 0,
						displayOptions: { show: { type: [2] } },
					},
					{
						displayName: '权限',
						name: 'auth',
						type: 'options',
						default: 1,
						options: authOptions,
					},
				],
			},
		],
	},
];
