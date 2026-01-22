import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['agent'],
	operation: ['listAppShareInfo'],
};

export const listAppShareInfoDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: 0,
		description: '上级/上游企业应用agentid',
	},
	{
		displayName: '业务类型',
		name: 'business_type',
		type: 'options',
		displayOptions: {
			show: showOnly,
		},
		options: [
			{
				name: '企业互联/局校互联',
				value: 0,
			},
			{
				name: '上下游企业',
				value: 1,
			},
		],
		default: 0,
	},
	{
		displayName: '下级/下游企业Corpid',
		name: 'corpid',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '下级/下游企业corpid，若指定该参数则表示拉取该下级/下游企业的应用共享信息',
	},
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 0,
			maxValue: 100,
		},
		displayOptions: {
			show: showOnly,
		},
		default: 0,
		description: '返回的最大记录数，整型，最大值100',
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
];
