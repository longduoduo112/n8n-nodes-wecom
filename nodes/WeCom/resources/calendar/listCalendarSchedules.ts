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
		description: '要查询日程的日历唯一标识ID',
	},
	{
		displayName: '偏移量',
		name: 'offset',
		type: 'number',
		displayOptions: {
			show: showOnlyForList,
		},
		default: 0,
		description: '分页查询的偏移量，用于获取后续页面的数据',
	},
	{
		displayName: '限制数量',
		name: 'limit',
		type: 'number',
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: showOnlyForList,
		},
		default: 50,
		description: '单次返回的日程数量上限，最多支持1000个',
	},
];

