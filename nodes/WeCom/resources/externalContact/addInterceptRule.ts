import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addInterceptRule'] };

export const addInterceptRuleDescription: INodeProperties[] = [
	{
		displayName: '规则名称（必填）',
		name: 'rule_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '规则名称，长度1~20个utf8字符',
	},
	{
		displayName: '敏感词列表（必填）',
		name: 'word_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		typeOptions: { rows: 3 },
		description: '敏感词列表，多个敏感词用逗号分隔。敏感词长度1~32个utf8字符，列表大小不能超过300个',
		placeholder: '敏感词1,敏感词2',
	},
	{
		displayName: '拦截方式（必填）',
		name: 'intercept_type',
		type: 'options',
		required: true,
		options: [
			{ name: '警告并拦截发送', value: 1 },
			{ name: '仅发警告', value: 2 },
		],
		default: 1,
		displayOptions: { show: showOnly },
		description: '拦截方式',
	},
	// 适用范围
	{
		displayName: '适用范围类型',
		name: 'applicableRangeType',
		type: 'options',
		required: true,
		options: [
			{ name: '按成员', value: 'user' },
			{ name: '按部门', value: 'department' },
			{ name: '成员和部门', value: 'both' },
		],
		default: 'user',
		displayOptions: { show: showOnly },
		description: '敏感词适用范围，userid与department不能同时为不填',
	},
	{
		displayName: '成员UserID列表',
		name: 'applicable_user_list',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, applicableRangeType: ['user', 'both'] } },
		description: '可使用的userid列表，用逗号分隔。必须为应用可见范围内的成员；最多支持传1000个节点',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '部门ID列表',
		name: 'applicable_department_list',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, applicableRangeType: ['department', 'both'] } },
		description: '可使用的部门ID列表，用逗号分隔。必须为应用可见范围内的部门；最多支持传1000个节点',
		placeholder: '1,2,3',
	},
	// 额外拦截语义
	{
		displayName: '启用额外拦截语义',
		name: 'enableSemantics',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否启用额外的拦截语义规则',
	},
	{
		displayName: '额外拦截语义规则',
		name: 'semantics_list',
		type: 'multiOptions',
		options: [
			{ name: '手机号', value: 1 },
			{ name: '邮箱地址', value: 2 },
			{ name: '红包', value: 3 },
		],
		default: [],
		displayOptions: { show: { ...showOnly, enableSemantics: [true] } },
		description: '额外的拦截语义规则',
	},
];
