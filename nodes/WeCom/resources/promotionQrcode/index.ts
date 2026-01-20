import type { INodeProperties } from 'n8n-workflow';

export const promotionQrcodeDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
			},
		},
		options: [
			{
				name: '[推广二维码] 获取注册码',
				value: 'getRegisterCode',
				description: '根据注册推广包生成注册码（register_code）',
				action: '获取注册码',
			},
			{
				name: '[推广二维码] 查询注册状态',
				value: 'getRegisterInfo',
				description: '查询通过注册定制化新创建的企业注册状态',
				action: '查询注册状态',
			},
			{
				name: '[推广二维码] 设置授权应用可见范围',
				value: 'setAgentScope',
				description: '设置授权应用的可见范围（成员、部门、标签）',
				action: '设置授权应用可见范围',
			},
			{
				name: '[推广二维码] 设置通讯录同步完成',
				value: 'setContactSyncSuccess',
				description: '设置通讯录同步完成，解除通讯录锁定状态',
				action: '设置通讯录同步完成',
			},
		],
		default: 'getRegisterCode',
	},
	{
		displayName: 'Provider Access Token',
		name: 'providerAccessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
			},
		},
		default: '',
		description: '服务商provider_access_token，获取方法参见服务商的凭证',
	},
	{
		displayName: '推广包ID',
		name: 'templateId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '推广二维码的模板ID，最长为128个字节。在"服务商管理端-应用管理-推广二维码"，创建的推广码详情可查看',
	},
	{
		displayName: '企业名称',
		name: 'corpName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '企业名称。若传递该参数，则在进入注册企业填写信息时，相应的值会自动填到表格中',
	},
	{
		displayName: '管理员姓名',
		name: 'adminName',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '管理员姓名。若传递该参数，则在进入注册企业填写信息时，相应的值会自动填到表格中',
	},
	{
		displayName: '管理员手机号',
		name: 'adminMobile',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '管理员手机号。若传递该参数，则在进入注册企业填写信息时，相应的值会自动填到表格中',
	},
	{
		displayName: 'State值',
		name: 'state',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '用户自定义的状态值。只支持英文字母和数字，最长为128字节。若指定该参数，接口"查询注册状态"及"注册完成回调事件"会相应返回该字段值',
	},
	{
		displayName: '跟进人userid',
		name: 'followUser',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterCode'],
			},
		},
		default: '',
		description: '跟进人的userid。必须是服务商所在企业的成员。若配置该值，则由该注册码创建的企业，在服务商管理后台，该企业的报备记录会自动标注跟进人员为指定成员',
	},
	{
		displayName: '注册码',
		name: 'registerCode',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['getRegisterInfo'],
			},
		},
		default: '',
		description: '查询的注册码。register_code生成后的查询有效期为24小时。仅支持注册完成回调事件或者获取注册码返回的register_code调用',
	},
	{
		displayName: 'Access Token',
		name: 'accessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description: '查询注册状态接口返回的access_token（跟注册完成回调事件的AccessToken参数一致，请注意与provider_access_token的区别）',
	},
	{
		displayName: '授权方应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: 1,
		description: '需要设置可见范围的应用ID',
	},
	{
		displayName: '应用可见范围（成员）',
		name: 'allowUser',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description: '成员userid列表，多个用逗号分隔。若未填该字段，则清空可见范围中成员列表',
		placeholder: '例如: zhansan,lisi',
	},
	{
		displayName: '应用可见范围（部门）',
		name: 'allowParty',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description: '部门ID列表，多个用逗号分隔。若未填该字段，则清空可见范围中部门列表',
		placeholder: '例如: 1,2,3',
	},
	{
		displayName: '应用可见范围（标签）',
		name: 'allowTag',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setAgentScope'],
			},
		},
		default: '',
		description: '标签ID列表，多个用逗号分隔。若未填该字段，则清空可见范围中标签列表',
		placeholder: '例如: 1,2,3',
	},
	{
		displayName: 'Access Token',
		name: 'accessToken',
		type: 'string',
		typeOptions: {
			password: true,
		},
		required: true,
		displayOptions: {
			show: {
				resource: ['promotionQrcode'],
				operation: ['setContactSyncSuccess'],
			},
		},
		default: '',
		description: '查询注册状态接口返回的access_token（跟注册完成回调事件的AccessToken参数一致，请注意与provider_access_token的区别）',
	},
];
