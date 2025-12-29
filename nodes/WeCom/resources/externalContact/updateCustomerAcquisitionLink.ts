import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['updateCustomerAcquisitionLink'] };

export const updateCustomerAcquisitionLinkDescription: INodeProperties[] = [
	{
		displayName: '链接ID',
		name: 'link_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '要更新的获客链接ID',
	},
	{
		displayName: '链接名称',
		name: 'link_name',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '获客链接的新名称（可选）',
	},
	{
		displayName: '更新使用范围',
		name: 'updateRange',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否更新使用范围',
	},
	{
		displayName: '使用范围类型',
		name: 'rangeType',
		type: 'options',
		displayOptions: { show: { ...showOnly, updateRange: [true] } },
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
		displayOptions: { show: { ...showOnly, updateRange: [true], rangeType: ['user'] } },
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
		displayOptions: { show: { ...showOnly, updateRange: [true], rangeType: ['department'] } },
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
];
