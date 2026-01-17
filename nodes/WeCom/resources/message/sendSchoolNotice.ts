import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSchoolNotice = {
	resource: ['message'],
	operation: ['sendSchoolNotice'],
};

export const sendSchoolNoticeDescription: INodeProperties[] = [
	{
		displayName: '接收对象',
		name: 'touser',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		placeholder: 'user1|user2|user3 或 @all',
		description:
			'可选。指定接收消息的成员，成员ID列表（多个接收者用|分隔，最多支持1000个）。特殊情况：指定为@all，则向该企业应用的全部成员发送。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '接收部门',
		name: 'toparty',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		placeholder: '1|2|3',
		description:
			'可选。指定接收消息的部门，部门ID列表，多个接收者用|分隔，最多支持100个。当touser为@all时忽略本参数。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '接收标签',
		name: 'totag',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		placeholder: 'tag1|tag2',
		description:
			'可选。指定接收消息的标签，标签ID列表，多个接收者用|分隔，最多支持100个。当touser为@all时忽略本参数。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '标题',
		name: 'title',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		placeholder: '请输入通知标题',
		description:
			'消息标题，最多64个字节。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '消息内容',
		name: 'description',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		required: true,
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		placeholder: '请输入通知内容',
		description:
			'消息内容，最多600个字节。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '点击后跳转的链接',
		name: 'url',
		type: 'string',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '',
		placeholder: 'https://example.com',
		description:
			'可选。点击后跳转的链接。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '是否放大第一个Card',
		name: 'emphasis_first_item',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: false,
		description:
			'可选。是否放大第一个card样式。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
	{
		displayName: '内容区域',
		name: 'content_item',
		type: 'json',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForSchoolNotice,
		},
		default: '[]',
		placeholder: '[{"key": "课程", "value": "数学"}, {"key": "时间", "value": "9:00-10:00"}]',
		description:
			'可选。内容区，card_action和content_item至少要有一个，JSON数组格式。<a href="https://developer.work.weixin.qq.com/document/path/91609" target="_blank">官方文档</a>',

	},
];
