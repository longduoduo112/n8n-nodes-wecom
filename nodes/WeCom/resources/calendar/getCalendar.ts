import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGet = {
	resource: ['calendar'],
	operation: ['getCalendar'],
};

export const getCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历ID列表',
		name: 'cal_id_list',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGet,
		},
		default: '',
		description: '要查询的日历ID列表，多个日历ID用逗号分隔',
	},
];

