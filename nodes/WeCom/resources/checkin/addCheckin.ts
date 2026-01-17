import type { INodeProperties } from 'n8n-workflow';

const showOnlyForAddCheckin = {
	resource: ['checkin'],
	operation: ['addCheckin'],
};

export const addCheckinDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: '',
		description: '需要补卡的员工UserID',
	},
	{
		displayName: '打卡时间',
		name: 'checkintime',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		default: 0,
		description: '补卡的打卡时间，使用Unix时间戳格式（秒级）',
	},
	{
		displayName: '打卡类型',
		name: 'checkintype',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForAddCheckin,
		},
		options: [
			{ name: '上班', value: 'OnDuty' },
			{ name: '下班', value: 'OffDuty' },
		],
		default: 'OnDuty',
		description: '打卡类型。OnDuty表示上班打卡，OffDuty表示下班打卡',
	},
];

