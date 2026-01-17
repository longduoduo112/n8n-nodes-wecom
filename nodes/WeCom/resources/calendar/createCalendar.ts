import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreate = {
	resource: ['calendar'],
	operation: ['createCalendar'],
};

export const createCalendarDescription: INodeProperties[] = [
	{
		displayName: '日历标题',
		name: 'summary',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '日历标题，支持中文、英文、数字和部分特殊字符，长度限制128个字符。<a href="https://developer.work.weixin.qq.com/document/path/93647" target="_blank">官方文档</a>',
		placeholder: '部门会议日历',
	},
	{
		displayName: '管理员列表',
		name: 'admins',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '管理员UserID列表，用逗号分隔。第一个为组织者，最多支持2000人。<a href="https://developer.work.weixin.qq.com/document/path/93647" target="_blank">官方文档</a>',
		placeholder: 'zhangsan,lisi,wangwu',
	},
	{
		displayName: '日历描述',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '',
		description: '可选。日历描述，支持中文、英文、数字和部分特殊字符，长度限制512个字符。<a href="https://developer.work.weixin.qq.com/document/path/93647" target="_blank">官方文档</a>',
		placeholder: '用于管理部门日常会议和活动',
	},
	{
		displayName: '颜色',
		name: 'color',
		type: 'options',
		displayOptions: {
			show: showOnlyForCreate,
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
		description: '可选。日历颜色，用于在客户端显示时区分不同日历。<a href="https://developer.work.weixin.qq.com/document/path/93647" target="_blank">官方文档</a>',
	},
	{
		displayName: '共享范围',
		name: 'shares',
		type: 'json',
		displayOptions: {
			show: showOnlyForCreate,
		},
		default: '[{"userid": "userid1"}]',
		description: '可选。共享范围，JSON数组格式。可包含userid（成员ID）或partyid（部门ID）。<a href="https://developer.work.weixin.qq.com/document/path/93647" target="_blank">官方文档</a>',
	},
];

