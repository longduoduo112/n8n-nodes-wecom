import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['calendar'],
	operation: ['updateCalendar'],
};

export const updateCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历ID',
		name: 'cal_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '要更新的日历唯一标识ID',
	},
	{
		displayName: '日历标题',
		name: 'summary',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日历标题，支持中文、英文、数字和部分特殊字符',
	},
	{
		displayName: '日历描述',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日历描述，支持中文、英文、数字和部分特殊字符',
	},
	{
		displayName: '颜色',
		name: 'color',
		type: 'options',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		options: [
			{ name: '默认蓝色', value: 0 },
			{ name: '荔枝红', value: 1 },
			{ name: '石榴红', value: 2 },
			{ name: '南瓜橙', value: 3 },
			{ name: '柠檬黄', value: 4 },
			{ name: '嫩草绿', value: 5 },
			{ name: '葱心绿', value: 6 },
			{ name: '天空蓝', value: 7 },
			{ name: '海水蓝', value: 8 },
			{ name: '丁香紫', value: 9 },
			{ name: '芋头紫', value: 10 },
			{ name: '灰', value: 11 },
		],
		default: 0,
		description: '日历颜色，用于在客户端显示时区分不同日历',
	},
	{
		displayName: '共享范围',
		name: 'shares',
		type: 'json',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '共享范围，JSON格式数组。可包含userid（成员ID）或partyid（部门ID）',
	},
];

