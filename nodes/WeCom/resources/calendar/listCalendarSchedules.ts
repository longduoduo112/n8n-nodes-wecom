import type { INodeProperties } from 'n8n-workflow';

const showOnlyForList = {
	resource: ['calendar'],
	operation: ['listCalendarSchedules'],
};

export const listCalendarSchedulesDescription: INodeProperties[] = [
	{
		displayName: '日历ID',
		name: 'cal_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForList,
		},
		default: '',
		description: '日历ID。仅可获取应用自己创建的日历下的日程',
		placeholder: 'wcjgewCwAAqeJcPI1d8Pwbjt7nttzAAA',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: showOnlyForList,
		},
		typeOptions: {
			minValue: 0,
		},
		default: 0,
		description: '分页，偏移量。默认为0',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		displayOptions: {
			show: showOnlyForList,
		},
		default: 500,
		description: '分页，预期请求的数据量。默认为500，取值范围 1 ~ 1000',
	},
];

