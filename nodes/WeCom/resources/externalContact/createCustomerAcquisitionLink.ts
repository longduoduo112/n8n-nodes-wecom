import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['createCustomerAcquisitionLink'] };

export const createCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '链接名称',
		name: 'link_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '获客链接的名称',
		placeholder: '官网获客链接',
	},
	{
		displayName: '使用范围类型',
		name: 'rangeType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '指定成员', value: 'user', description: '指定成员可使用此链接' },
			{ name: '指定部门', value: 'department', description: '指定部门可使用此链接' },
		],
		default: 'user',

	},
	{
		displayName: '成员列表',
		name: 'userCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, rangeType: ['user'] } },
		default: {},
		placeholder: '添加成员',
		typeOptions: { multipleValues: true },
		description: '可使用此链接的成员列表',
		options: [
			{
				displayName: '成员',
				name: 'users',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '成员的UserID',
					},
				],
			},
		],
	},
	{
		displayName: '部门列表',
		name: 'departmentCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, rangeType: ['department'] } },
		default: {},
		placeholder: '添加部门',
		typeOptions: { multipleValues: true },
		description: '可使用此链接的部门列表',
		options: [
			{
				displayName: '部门',
				name: 'departments',
				values: [
					{
						displayName: '部门ID',
						name: 'department_id',
						type: 'number',
						default: 0,
						required: true,

					},
				],
			},
		],
	},
	{
		displayName: '跳过验证',
		name: 'skip_verify',
		type: 'boolean',
		default: true,
		displayOptions: { show: showOnly },
		description: '外部客户通过此链接添加时是否无需验证',
	},
];
