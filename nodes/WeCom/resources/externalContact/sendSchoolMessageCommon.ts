import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendSchoolMessage = {
	resource: ['externalContact'],
	operation: ['sendSchoolMessage'],
};

export const sendSchoolMessageCommonDescription: INodeProperties[] = [
	{
		displayName: '消息类型',
		name: 'msgtype',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		options: [
			{
				name: '文本消息',
				value: 'text',
			},
			{
				name: '图片消息',
				value: 'image',
			},
			{
				name: '语音消息',
				value: 'voice',
			},
			{
				name: '视频消息',
				value: 'video',
			},
			{
				name: '文件消息',
				value: 'file',
			},
			{
				name: '图文消息',
				value: 'news',
			},
			{
				name: '图文消息 (mpnews)',
				value: 'mpnews',
			},
			{
				name: '小程序消息',
				value: 'miniprogram',
			},
		],
		default: 'text',
		required: true,
		description:
			'选择要发送的消息类型。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。选择消息类型',
	},
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: 0,
		required: true,
		description: '企业应用的ID，整型。可在应用的设置页面查看。必填。企业应用的ID，整型。可在应用的设置页面查看',
	},
	{
		displayName: '指定发送对象',
		name: 'recv_scope',
		type: 'options',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		options: [
			{
				name: '发送给家长',
				value: 0,
			},
			{
				name: '发送给学生',
				value: 1,
			},
			{
				name: '发送给家长和学生',
				value: 2,
			},
		],
		default: 0,
		description:
			'可选。指定发送对象，0表示发送给家长，1表示发送给学生，2表示发送给家长和学生，默认为0。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>',
	},
	{
		displayName: '家长列表',
		name: 'to_parent_userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: '',
		placeholder: 'parent_userid1,parent_userid2',
		description:
			'可选。家校通讯录家长列表，recv_scope为0或2表示发送给对应的家长，recv_scope为1忽略，（最多支持1000个）。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。可选。家校通讯录家长列表，用逗号分隔，最多支持1000个。recv_scope为0或2时生效',
	},
	{
		displayName: '学生列表',
		name: 'to_student_userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: '',
		placeholder: 'student_userid1,student_userid2',
		description:
			'可选。家校通讯录学生列表，recv_scope为0表示发送给学生的所有家长，recv_scope为1表示发送给学生，recv_scope为2表示发送给学生和学生的所有家长（最多支持1000个）。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。可选。家校通讯录学生列表，用逗号分隔，最多支持1000个。recv_scope为0时发送给学生的所有家长，recv_scope为1时发送给学生，recv_scope为2时发送给学生和学生的所有家长',
	},
	{
		displayName: '部门列表',
		name: 'to_party',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: '',
		placeholder: 'partyid1,partyid2',
		description:
			'可选。家校通讯录部门列表，recv_scope为0表示发送给班级的所有家长，recv_scope为1表示发送给班级的所有学生，recv_scope为2表示发送给班级的所有学生和家长（最多支持100个）。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。可选。家校通讯录部门列表，用逗号分隔，最多支持100个。recv_scope为0时发送给班级的所有家长，recv_scope为1时发送给班级的所有学生，recv_scope为2时发送给班级的所有学生和家长',
	},
	{
		displayName: '发送给所有人',
		name: 'toall',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: false,
		description:
			'可选。1表示字段生效，0表示字段无效。recv_scope为0表示发送给学校的所有家长，recv_scope为1表示发送给学校的所有学生，recv_scope为2表示发送给学校的所有学生和家长，默认为0。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。可选。1表示发送给所有人，0表示不发送给所有人，默认0。recv_scope为0时发送给学校的所有家长，recv_scope为1时发送给学校的所有学生，recv_scope为2时发送给学校的所有学生和家长',
	},
	{
		displayName: '开启重复消息检查',
		name: 'enable_duplicate_check',
		type: 'boolean',
		displayOptions: {
			show: showOnlyForSendSchoolMessage,
		},
		default: false,
		description:
			'可选。表示是否开启重复消息检查，0表示否，1表示是，默认0。开启后，在一定时间间隔内，同样内容的消息不会重复收到。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。可选。表示是否开启重复消息检查，0表示否，1表示是，默认0',
	},
	{
		displayName: '重复消息检查时间间隔',
		name: 'duplicate_check_interval',
		type: 'number',
		displayOptions: {
			show: {
				...showOnlyForSendSchoolMessage,
				enable_duplicate_check: [true],
			},
		},
		default: 1800,
		description:
			'可选。表示重复消息检查的时间间隔，默认1800s，最大不超过4小时（14400秒）。<a href="https://developer.work.weixin.qq.com/document/path/92320" target="_blank">官方文档</a>。可选。重复消息检查的时间间隔（秒），默认1800秒，最大不超过14400秒（4小时）',
	},
];
