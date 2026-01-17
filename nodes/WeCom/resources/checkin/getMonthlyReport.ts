import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetMonthlyReport = {
	resource: ['checkin'],
	operation: ['getMonthlyReport'],
};

export const getMonthlyReportDescription: INodeProperties[] = [
	{
		displayName: '月份',
		name: 'month',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: 0,
		description: '查询的月份，使用Unix时间戳格式（秒级），例如传入该月第一天的时间戳',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetMonthlyReport,
		},
		default: '',
		description: '需要获取月报的成员UserID列表，多个UserID用逗号分隔',
	},
];

