import type { INodeProperties } from 'n8n-workflow';

export const getDeviceListDescription: INodeProperties[] = [
	{
		displayName: '设备类型',
		name: 'type',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getDeviceList'],
			},
		},
		description: '查询设备类型',
		options: [
			{
				name: '可信企业设备',
				value: 1,
				description: '企业内可信的设备',
			},
			{
				name: '未知设备',
				value: 2,
				description: '尚未确认的设备',
			},
			{
				name: '可信个人设备',
				value: 3,
				description: '个人可信的设备',
			},
		],
		default: 1,
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getDeviceList'],
			},
		},
		default: '',
		description: '分页游标，用于获取分页数据。第一次调用可不填',
	},
	{
		displayName: '限制条数',
		name: 'limit',
		type: 'number',

		displayOptions: {
			show: {
				resource: ['security'],
				operation: ['getDeviceList'],
			},
		},
		default: 100,
		description: '查询返回的最大记录数，最高不超过100',
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
	},
];
