import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetScheduleList = {
	resource: ['checkin'],
	operation: ['getScheduleList'],
};

export const getScheduleListDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: 0,
		description: '查询排班的起始时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: 0,
		description: '查询排班的结束时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetScheduleList,
		},
		default: '',
		description: '需要获取排班信息的成员UserID列表，多个UserID用逗号分隔',
	},
];

