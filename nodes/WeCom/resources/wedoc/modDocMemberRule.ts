import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modDocMemberRule'] };

const memberTypeOptions = [
	{ name: '成员', value: 1, description: '企业成员' },
	{ name: '部门', value: 2, description: '企业部门' },
];

const authOptions = [
	{ name: '只读', value: 1, description: '只能查看' },
	{ name: '可编辑', value: 2, description: '可以编辑内容' },
	{ name: '管理员', value: 3, description: '管理员权限' },
];

export const modDocMemberRuleDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid。', hint: '文档ID' },
	{
		displayName: '添加成员',
		name: 'addMemberCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '要添加的文档成员',
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
						options: memberTypeOptions,
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
						description: '成员权限级别',
					},
				],
			},
		],
	},
	{
		displayName: '删除成员',
		name: 'delMemberCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '删除成员',
		typeOptions: { multipleValues: true },
		description: '要移除的文档成员',
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
						options: memberTypeOptions,
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
	{
		displayName: '更新成员权限',
		name: 'updateMemberCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '更新权限',
		typeOptions: { multipleValues: true },
		description: '要更新权限的成员',
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
						options: memberTypeOptions,
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
						displayName: '新权限',
						name: 'auth',
						type: 'options',
						default: 1,
						options: authOptions,
						description: '新的权限级别',
					},
				],
			},
		],
	},
];
