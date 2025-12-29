import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['checkin'], operation: ['addCheckinRecord'] };

export const addCheckinRecordDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '成员的UserID',
	},
	{
		displayName: '打卡时间',
		name: 'checkin_time',
		type: 'number',
		required: true,
		displayOptions: { show: showOnly },
		default: 0,
		description: '打卡时间戳（秒）',
	},
	{
		displayName: '打卡类型',
		name: 'checkin_type',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '上班打卡', value: 1 },
			{ name: '下班打卡', value: 2 },
			{ name: '外出打卡', value: 3 },
		],
		default: 1,

	},
	{
		displayName: '定位地址',
		name: 'location_title',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '打卡地点的地址名称（可选）',
	},
	{
		displayName: '经度',
		name: 'lng',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: '打卡地点的经度（可选）',
	},
	{
		displayName: '纬度',
		name: 'lat',
		type: 'number',
		displayOptions: { show: showOnly },
		default: 0,
		description: '打卡地点的纬度（可选）',
	},
	{
		displayName: '备注',
		name: 'remark',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '打卡备注（可选）',
	},
];
