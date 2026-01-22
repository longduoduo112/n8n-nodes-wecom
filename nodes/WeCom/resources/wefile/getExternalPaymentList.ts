import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['wefile'],
	operation: ['getExternalPaymentList'],
};

export const getExternalPaymentListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'beginTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '收款记录开始时间，单位为秒',
	},
	{
		displayName: '结束时间',
		name: 'endTime',
		type: 'dateTime',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '收款记录结束时间，单位为秒，起止时间间隔不能超过1个月',
	},
	{
		displayName: '收款成员UserID',
		name: 'payee_userid',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '企业收款成员userid，不填则为全部成员',
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
	{
		displayName: '返回数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		displayOptions: {
			show: showOnly,
		},
		default: 1000,
		description: '返回的最大记录数，整型，最大值1000',
	},
];
