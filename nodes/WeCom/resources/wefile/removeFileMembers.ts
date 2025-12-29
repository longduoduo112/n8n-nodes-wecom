import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['removeFileMembers'] };

export const removeFileMembersDescription: INodeProperties[] = [
	{
		displayName: '文件ID',
		name: 'fileId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '文件或文件夹的ID',
		hint: '文件ID',
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
		description: '要移除的成员或部门',
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
				],
			},
		],
	},
];
