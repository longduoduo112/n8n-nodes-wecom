import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['manageKnowledgeGroup'] };

export const manageKnowledgeGroupDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '新增分组', value: 'add', description: '创建新的知识库分组' },
			{ name: '删除分组', value: 'del', description: '删除已存在的知识库分组' },
			{ name: '修改分组', value: 'mod', description: '修改知识库分组的名称' },
			{ name: '获取分组列表', value: 'list', description: '查询所有知识库分组' },
		],
		default: 'list',
		description: '选择对知识库分组进行的管理操作',
	},
	// 新增分组参数
	{
		displayName: '分组名称',
		name: 'group_name',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['add'] } },
		default: '',
		description: '知识库分组的名称',
		placeholder: '产品问题',
	},
	// 删除/修改分组参数
	{
		displayName: '分组ID',
		name: 'group_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['del', 'mod'] } },
		default: '',
		description: '知识库分组的唯一ID',
	},
	// 修改分组参数
	{
		displayName: '新分组名称',
		name: 'new_group_name',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['mod'] } },
		default: '',
		description: '新的知识库分组名称',
	},
	// 列表查询参数
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		default: '',
		description: '分页游标，首次请求留空',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { ...showOnly, action_type: ['list'] } },
		default: 50,
		description: '每页返回的分组数量',
		typeOptions: { minValue: 1, maxValue: 1000 },
	},
];
