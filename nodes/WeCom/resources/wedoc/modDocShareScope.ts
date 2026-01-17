import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['modDocShareScope'] };

const authOptions = [
	{ name: '只读', value: 1, description: '只能查看' },
	{ name: '可编辑', value: 2, description: '可以编辑内容' },
];

export const modDocShareScopeDescription: INodeProperties[] = [
	{ displayName: '文档ID', name: 'docid', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '文档的docid' },
	{
		displayName: '协作者权限列表',
		name: 'coAuthCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加协作者',
		typeOptions: { multipleValues: true },
		description: '设置协作者的权限',
		options: [
			{
				displayName: '协作者',
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
						description: '协作者类型',
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
						description: '协作权限级别',
					},
				],
			},
		],
	},
	{
		displayName: '只读时允许复制',
		name: 'enable_readonly_copy',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: '是否允许在只读情况下复制内容',
	},
	{
		displayName: '禁止对外分享',
		name: 'ban_share_external',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否禁止将文档分享给企业外部人员',
	},
	{
		displayName: '链接分享范围',
		name: 'share_scope',
		type: 'options',
		displayOptions: { show: showOnly },
		default: 1,
		options: [
			{ name: '仅指定成员可访问', value: 1 },
			{ name: '企业内获得链接的人可访问', value: 2 },
			{ name: '任何人获得链接都可访问', value: 3 },
		],
		description: '通过链接分享时的访问范围',
	},
];
