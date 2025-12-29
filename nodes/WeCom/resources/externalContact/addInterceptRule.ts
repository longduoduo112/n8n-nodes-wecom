import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['addInterceptRule'] };

export const addInterceptRuleDescription: INodeProperties[] = [
	{
		displayName: '规则名称',
		name: 'rule_name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '拦截规则的名称',
	},
	{
		displayName: '敏感词列表',
		name: 'word_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '要拦截的敏感词列表，多个敏感词用逗号分隔',
		placeholder: '敏感词1,敏感词2',
	},
	{
		displayName: '适用范围',
		name: 'semanticsCollection',
		type: 'fixedCollection',
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加语义范围',
		typeOptions: { multipleValues: true },
		description: '规则适用的语义范围（可选）',
		options: [
			{
				displayName: '语义',
				name: 'semantics',
				values: [
					{
						displayName: '语义类型',
						name: 'type',
						type: 'options',
						default: 1,
						options: [
							{ name: '违规', value: 1 },
							{ name: '骚扰', value: 2 },
							{ name: '诈骗', value: 3 },
						],

					},
				],
			},
		],
	},
];
