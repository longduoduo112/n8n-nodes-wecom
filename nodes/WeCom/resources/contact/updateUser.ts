import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdate = {
	resource: ['contact'],
	operation: ['updateUser'],
};

export const updateUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'zhangsan',
		description: '成员 UserID，企业内必须唯一。不区分大小写，长度为1~64个字节。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '要更新的成员 UserID',
	},
	{
		displayName: '姓名',
		name: 'name',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '张三',
		description: '可选。成员名称，长度为1~64个utf8字符。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '手机号',
		name: 'mobile',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '13800138000',
		description: '可选。手机号码，企业内必须唯一。若成员已激活企业微信，则需成员自行修改（此情况下该参数被忽略，但不会报错）。中国大陆手机号码可省略"+86"，其他国家或地区必须要带上国际码。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '手机号码，企业内唯一',
	},
	{
		displayName: '所属部门',
		name: 'department',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '1,2,3',
		description: '可选。成员所属部门 ID 列表，不超过100个。多个部门用逗号分隔。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '部门 ID 列表，如：1,2,3，成员可属于多个部门',
	},
	{
		displayName: '职务信息',
		name: 'position',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '产品经理',
		description: '可选。职务信息，长度为0~128个字符。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '性别',
		name: 'gender',
		type: 'options',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		options: [
			{
				name: '保密',
				value: '0',
			},
			{
				name: '男',
				value: '1',
			},
			{
				name: '女',
				value: '2',
			},
		],
		default: '0',
		description: '可选。性别，0表示未定义，1表示男性，2表示女性。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '邮箱',
		name: 'email',
		type: 'string',
		placeholder: 'zhangsan@example.com',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		description: '可选。邮箱地址，长度6~64个字节，且为有效的 email 格式。企业内必须唯一。可填写企业已有的邮箱账号，方便同事获取成员的邮箱账号以发邮件。境外成员可用此邮箱登录企业微信。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '企业内唯一的邮箱地址',
	},
	{
		displayName: '企业邮箱',
		name: 'biz_mail',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'zhangsan@company.com',
		description: '可选。如果企业已开通腾讯企业邮（企业微信邮箱），设置该值可创建企业邮箱账号。长度6~63个字节，且为有效的企业邮箱格式。企业内必须唯一。未填写则系统会为用户生成默认企业邮箱（由系统生成的邮箱可修改一次）。如果创建时「企业邮箱」为系统默认分配的，则仅允许修改一次。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '企业邮箱，需企业已开通企业邮箱服务',
	},
	{
		displayName: '地址',
		name: 'address',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '北京市海淀区...',
		description: '可选。地址，长度最大128个字符。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '别名',
		name: 'alias',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'jackzhang',
		description: '可选。成员别名，长度1~64个utf8字符。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '座机',
		name: 'telephone',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '010-12345678',
		description: '可选。座机号码，32字节以内，由纯数字、"-"、"+" 或 "," 组成。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '启用状态',
		name: 'enable',
		type: 'options',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		options: [
			{
				name: '启用',
				value: 1,
			},
			{
				name: '禁用',
				value: 0,
			},
		],
		default: 1,
		description: '1表示启用成员，0表示禁用成员。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
	},
	{
		displayName: '头像MediaID',
		name: 'avatar_mediaid',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '请输入头像的 media_id...',
		description: '可选。成员头像的 mediaid，通过素材管理接口上传图片获得。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '需先通过素材管理接口上传图片',
	},
	{
		displayName: '成员对外属性',
		name: 'external_profile',
		type: 'json',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '{}',
		placeholder: '{"external_corp_name":"企业简称","wechat_channels":{"nickname":"视频号名称"},"external_attr":[...]}',
		description: '可选。成员对外属性，用于配置成员在外部联系人中显示的信息。支持external_corp_name（企业简称）、wechat_channels（视频号）、external_attr（扩展属性）等字段。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: 'JSON 格式，配置对外显示的企业简称、视频号、属性等',
	},
	{
		displayName: '部门排序值',
		name: 'order',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '10,40',
		description: '可选。部门内的排序值，默认为0。当有传入department时有效。数量必须和department一致，数值越大排序越前面。有效的值范围是[0, 2^32)。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '部门排序值列表，如：10,40，需与部门ID列表一一对应',
	},
	{
		displayName: '是否为部门负责人',
		name: 'is_leader_in_dept',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '1,0',
		description: '可选。部门负责人字段，个数必须和department一致，表示在所在的部门内是否为负责人。0-否，1-是。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '部门负责人标识列表，如：1,0，需与部门ID列表一一对应',
	},
	{
		displayName: '直属上级UserID',
		name: 'direct_leader',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'lisi',
		description: '可选。直属上级，可以设置企业范围内成员为直属上级，最多设置1个。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '直属上级的UserID，如：lisi（最多1个）',
	},
	{
		displayName: '主部门',
		name: 'main_department',
		type: 'number',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: 0,
		description: '可选。主部门。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '主部门ID',
	},
	{
		displayName: '扩展属性',
		name: 'extattr',
		type: 'json',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '{}',
		placeholder: '{"attrs":[{"type":0,"name":"文本名称","text":{"value":"文本"}}]}',
		description: '可选。扩展属性。扩展属性字段需要先在WEB管理端添加，否则忽略未知属性的赋值。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: 'JSON格式，包含attrs数组，支持文本、网页、小程序等类型',
	},
	{
		displayName: '对外职务',
		name: 'external_position',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: '工程师',
		description: '可选。对外职务，如果设置了该值，则以此作为对外展示的职务，否则以position来展示。不超过12个汉字。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '对外展示的职务名称',
	},
	{
		displayName: '企业邮箱别名',
		name: 'biz_mail_alias',
		type: 'json',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '{}',
		placeholder: '{"item":["jack@tencent.com","hr@tencent.com"]}',
		description: '可选。企业邮箱别名，长度6~63个字节，且为有效的企业邮箱格式。企业内必须唯一，最多可设置5个别名。更新时为覆盖式更新。传空结构或传空数组会清空当前企业邮箱别名。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: 'JSON格式，包含item数组，最多5个别名',
	},
	{
		displayName: '新UserID',
		name: 'new_userid',
		type: 'string',
		displayOptions: {
			show: showOnlyForUpdate,
		},
		default: '',
		placeholder: 'new_zhangsan',
		description: '可选。如果userid由系统自动生成，则仅允许修改一次。新值可由new_userid字段指定。<a href="https://developer.work.weixin.qq.com/document/path/90197" target="_blank">官方文档</a>',
		hint: '仅当userid由系统自动生成时可修改一次',
	},
];

