import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['externalContact'], operation: ['getGroupChatStatistic'] };

export const getGroupChatStatisticDescription: INodeProperties[] = [
	{
		displayName: '数据日期',
		name: 'day_begin_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '统计数据的起始日期时间戳（秒级Unix时间戳），填写当天的0时0分0秒',
	},
	{
		displayName: '数据日期（可选）',
		name: 'day_end_time',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description: '统计数据的结束日期时间戳（秒级Unix时间戳），可选',
	},
	{
		displayName: '按群主筛选',
		name: 'filterByOwner',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '是否按群主ID过滤统计数据',
	},
	{
		displayName: '群主ID列表',
		name: 'ownerCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, filterByOwner: [true] } },
		default: {},
		placeholder: '添加群主',
		typeOptions: { multipleValues: true },
		description: '群主UserID列表',
		options: [
			{
				displayName: '群主',
				name: 'owners',
				values: [
					{
						displayName: '群主UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '群主的UserID',
					},
				],
			},
		],
	},
	{
		displayName: '排序方式',
		name: 'order_by',
		type: 'options',
		options: [
			{ name: '新增群数', value: 1 },
			{ name: '群总数', value: 2 },
			{ name: '新增群人数', value: 3 },
			{ name: '群总人数', value: 4 },
		],
		default: 1,
		displayOptions: { show: showOnly },
		description: '统计数据的排序方式',
	},
	{
		displayName: '升序还是降序',
		name: 'order_asc',
		type: 'boolean',
		default: false,
		displayOptions: { show: showOnly },
		description: '排序顺序。true表示升序，false表示降序',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		default: 0,
		displayOptions: { show: showOnly },
		description: '分页查询的偏移量',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		displayOptions: { show: showOnly },
		description: '单次返回的数据量上限，最大支持1000',
	},
];
