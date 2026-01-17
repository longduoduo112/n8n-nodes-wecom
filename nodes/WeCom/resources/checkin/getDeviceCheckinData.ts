import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDeviceCheckinData = {
	resource: ['checkin'],
	operation: ['getDeviceCheckinData'],
};

export const getDeviceCheckinDataDescription: INodeProperties[] = [
	{
		displayName: '开始时间',
		name: 'starttime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: 0,
		description: '查询的起始时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '结束时间',
		name: 'endtime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: 0,
		description: '查询的结束时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '成员UserID列表',
		name: 'useridlist',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeviceCheckinData,
		},
		default: '',
		description: '需要获取设备打卡数据的成员UserID列表，多个UserID用逗号分隔',
	},
];

