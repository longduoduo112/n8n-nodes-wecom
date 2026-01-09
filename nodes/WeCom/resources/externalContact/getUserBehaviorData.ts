import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getUserBehaviorData'],
};

export const getUserBehaviorDataDescription: INodeProperties[] = [
	{
		displayName: '筛选类型',
		name: 'filterType',
		type: 'options',
		options: [
			{ name: '按成员', value: 'user' },
			{ name: '按部门', value: 'party' },
		],
		default: 'user',
		displayOptions: { show: showOnly },
		description: 'Userid和partyid不可同时为空',
	},
	{
		displayName: '成员UserID列表',
		name: 'userid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, filterType: ['user'] } },
		description: '成员ID列表，用逗号分隔，最多100个。如传入多个userid，则表示获取这些成员总体的联系客户数据',
		placeholder: 'zhangsan,lisi',
	},
	{
		displayName: '部门ID列表',
		name: 'partyid',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, filterType: ['party'] } },
		description: '部门ID列表，用逗号分隔，最多100个',
		placeholder: '1001,1002',
	},
	{
		displayName: '起始时间（必填）',
		name: 'start_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '数据起始时间（Unix时间戳）。查询的时间范围为[start_time,end_time]，最大查询跨度为30天，最多可获取最近180天内的数据',
	},
	{
		displayName: '结束时间（必填）',
		name: 'end_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '数据结束时间（Unix时间戳）。当传入的时间不为0点时间戳时，会向下取整',
	},
];
