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
		description: '日历标题，支持中文、英文、数字和部分特殊字符，长度限制128个字符',
		placeholder: '部门会议日历',
	},
	{
		displayName: '日历描述',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '日历描述，支持中文、英文、数字和部分特殊字符，长度限制512个字符',
		placeholder: '用于管理部门日常会议和活动',
	},
	{
		displayName: '日历颜色',
		name: 'color',
		type: 'options',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '#0000FF',
		options: [
			{ name: '默认蓝色 (#0000FF)', value: '#0000FF' },
			{ name: '荔枝红 (#FF0000)', value: '#FF0000' },
			{ name: '石榴红 (#E60023)', value: '#E60023' },
			{ name: '南瓜橙 (#FF6600)', value: '#FF6600' },
			{ name: '柠檬黄 (#FFCC00)', value: '#FFCC00' },
			{ name: '嫩草绿 (#99CC00)', value: '#99CC00' },
			{ name: '葱心绿 (#00CC66)', value: '#00CC66' },
			{ name: '天空蓝 (#00CCFF)', value: '#00CCFF' },
			{ name: '海水蓝 (#0099CC)', value: '#0099CC' },
			{ name: '丁香紫 (#9966FF)', value: '#9966FF' },
			{ name: '芋头紫 (#CC66CC)', value: '#CC66CC' },
			{ name: '灰色 (#999999)', value: '#999999' },
		],
		description: '日历颜色，RGB颜色编码16进制表示（如 #0000FF 表示纯蓝色）。可从列表选择预设颜色，或通过表达式输入自定义RGB格式。&lt;strong&gt;注意：全员日历不支持颜色设置&lt;/strong&gt;',
	},
	{
		displayName: '公开范围',
		name: 'publicRange',
		type: 'collection',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: {},
		placeholder: '添加公开范围',
		description: '可选。公开范围，仅当是公共日历时有效。可以选择公开成员列表、公开部门列表，或两者都选',
		options: [
			{
				displayName: '公开成员列表 Names or IDs',
				name: 'userids',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getAllUsers',
				},
				default: [],
				description: '公开的成员列表范围，最多指定1000个成员',
			},
			{
				displayName: '公开部门列表 Names or IDs',
				name: 'partyids',
				type: 'multiOptions',
				typeOptions: {
					loadOptionsMethod: 'getDepartments',
				},
				default: [],
				description: '公开的部门列表范围，最多指定100个部门',
			},
		],
	},
	{
		displayName: '日历通知范围',
		name: 'sharesCollection',
		type: 'fixedCollection',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: {},
		placeholder: '添加通知成员',
		typeOptions: {
			multipleValues: true,
		},
		description: '可选。日历通知范围成员列表，最多2000人',
		options: [
			{
				displayName: '通知成员',
				name: 'shares',
				values: [
					{
						displayName: '成员 Name or ID',
						name: 'userid',
						type: 'options',
						default: '',
						required: true,
						typeOptions: {
							loadOptionsMethod: 'getAllUsers',
						},
						description: '日历通知范围成员。可从列表选择或手动输入UserID',
					},
					{
						displayName: '权限',
						name: 'permission',
						type: 'options',
						default: 1,
						options: [
							{ name: '可查看', value: 1 },
							{ name: '仅查看闲忙状态', value: 3 },
						],
						description: '成员对日历的权限。不填则默认为「可查看」',
					},
				],
			},
		],
	},
];
