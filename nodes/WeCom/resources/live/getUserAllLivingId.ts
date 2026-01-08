import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['getUserAllLivingId'] };

export const getUserAllLivingIdDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'zhangsan',
	},
	{
		displayName: '可选参数',
		name: 'additionalFields',
		type: 'collection',
		placeholder: '添加可选参数',
		default: {},
		displayOptions: { show: showOnly },
		options: [
			{
				displayName: '游标',
				name: 'cursor',
				type: 'string',
				default: '',
				description: '上一次调用的返回的next_cursor',
			},
			{
				displayName: '每页数量',
				name: 'limit',
				type: 'number',
				default: 50,
				description: '每次拉取的数据量，默认值和最大值都为100',
				typeOptions: { minValue: 1, maxValue: 100 },
			},
		],
	},
];
