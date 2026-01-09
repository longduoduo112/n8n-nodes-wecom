import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentTaskList'],
};

export const getMomentTaskListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'start_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '朋友圈记录开始时间（Unix时间戳）。注意：朋友圈记录的起止时间间隔不能超过30天',
	},
	{
		displayName: '结束时间',
		name: 'end_time',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
		description: '朋友圈记录结束时间（Unix时间戳）',
	},
	{
		displayName: '创建人',
		name: 'creator',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '朋友圈创建人的userid',
	},
	{
		displayName: '朋友圈类型',
		name: 'filter_type',
		type: 'options',
		options: [
			{ name: '所有（企业+个人）', value: 2 },
			{ name: '企业发表', value: 0 },
			{ name: '个人发表', value: 1 },
		],
		default: 2,
		displayOptions: { show: showOnly },
		description: '朋友圈类型。0：企业发表 1：个人发表 2：所有，包括个人创建以及企业创建',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 20 },
		default: 20,
		displayOptions: { show: showOnly },
		description: '返回的最大记录数，整型，最大值20，默认值20',
	},
];

