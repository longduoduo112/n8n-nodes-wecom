import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['manageKnowledgeIntent'] };

export const manageKnowledgeIntentDescription: INodeProperties[] = [
	{
		displayName: '操作类型',
		name: 'action_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '新增问答', value: 'add', description: '创建新的知识库问答' },
			{ name: '删除问答', value: 'del', description: '删除已存在的知识库问答' },
			{ name: '修改问答', value: 'mod', description: '修改知识库问答内容' },
			{ name: '获取问答列表', value: 'list', description: '查询知识库中的问答列表' },
		],
		default: 'list',
		description: '选择对知识库问答进行的管理操作',
	},
	// 新增/修改问答参数
	{
		displayName: '分组ID',
		name: 'group_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['add', 'list'] } },
		default: '',
		description: '问答所属的分组ID',
	},
	{
		displayName: '问答ID',
		name: 'intent_id',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['del', 'mod'] } },
		default: '',
		description: '知识库问答的唯一ID',
	},
	{
		displayName: '问题内容',
		name: 'question_text',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['add', 'mod'] } },
		default: '',
		description: '问题的文本内容',
		placeholder: '如何申请退款？',
	},
	{
		displayName: '相似问法',
		name: 'similarQuestionsCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, action_type: ['add', 'mod'] } },
		default: {},
		placeholder: '添加相似问法',
		typeOptions: { multipleValues: true },
		description: '相似问法列表（可选）',
		options: [
			{
				displayName: '问法',
				name: 'questions',
				values: [
					{
						displayName: '相似问题',
						name: 'text',
						type: 'string',
						default: '',
						description: '相似问题的文本',
					},
				],
			},
		],
	},
	{
		displayName: '回答类型',
		name: 'answer_type',
		type: 'options',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['add', 'mod'] } },
		options: [
			{ name: '文本回答', value: 'text', description: '纯文本回答' },
		],
		default: 'text',
		description: '回答的消息类型',
	},
	{
		displayName: '回答内容',
		name: 'answer_text',
		type: 'string',
		required: true,
		displayOptions: { show: { ...showOnly, action_type: ['add', 'mod'] } },
		default: '',
		typeOptions: { rows: 4 },
		description: '回答的文本内容',
		placeholder: '您可以在订单详情页面申请退款...',
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
		description: '每页返回的问答数量',
		typeOptions: { minValue: 1, maxValue: 1000 },
	},
];
