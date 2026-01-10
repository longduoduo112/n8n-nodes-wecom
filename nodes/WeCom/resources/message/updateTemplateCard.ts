import type { INodeProperties } from 'n8n-workflow';
import { getRecipientFields } from './commonFields';

const showOnlyUpdateTemplateCard = {
	resource: ['message'],
	operation: ['updateTemplateCard'],
};

export const updateTemplateCardDescription: INodeProperties[] = [
	...getRecipientFields('updateTemplateCard'),
	{
		displayName: '原消息的Response_code',
		name: 'response_code',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'response_code_xxxxx',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		hint: '一个code只能调用一次该接口，且只能在72小时内调用',
		description:
			'更新卡片所需要消费的code，可通过发消息接口和回调接口返回值获取，一个code只能调用一次该接口，且只能在72小时内调用。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '模板卡片类型',
		name: 'card_type',
		type: 'options',
		options: [
		{
			name: '按钮交互型',
			value: 'button_interaction',
			description: '按钮交互型模板卡片',
		},
		{
			name: '多项选择型',
			value: 'multiple_interaction',
			description: '多项选择型模板卡片',
		},
		{
			name: '投票选择型',
			value: 'vote_interaction',
			description: '投票选择型模板卡片',
		},
		{
			name: '图文展示型',
			value: 'news_notice',
			description: '图文展示型模板卡片',
		},
		{
			name: '文本通知型',
			value: 'text_notice',
			description: '文本通知型模板卡片',
		},
	],
		default: 'text_notice',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description:
			'选择模板卡片的类型。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '卡片来源',
		name: 'source',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加来源信息',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '可选。模板卡片来源样式信息',
		options: [
			{
				name: 'sourceInfo',
				displayName: '来源信息',
				values: [
					{
						displayName: '来源图标URL',
						name: 'icon_url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com/icon.png',
						description: '来源图标的URL地址',
					},
					{
						displayName: '来源描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '企业微信',
						hint: '建议不超过20个字（支持ID转译）',
						description: '来源图片的描述，建议不超过20个字（支持ID转译）',
					},
					{
						displayName: '来源文字颜色',
						name: 'desc_color',
						type: 'options',
						options: [
							{
								name: '灰色（默认）',
								value: 0,
							},
							{
								name: '黑色',
								value: 1,
							},
							{
								name: '红色',
								value: 2,
							},
							{
								name: '绿色',
								value: 3,
							},
						],
						default: 0,
						description: '来源文字的颜色',
					},
				],
			},
		],
	},
	{
		displayName: '一级标题',
		name: 'main_title',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加标题',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '模板卡片的主要内容，包含一级标题和标题辅助信息',
		options: [
			{
				name: 'titleInfo',
				displayName: '标题内容',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '欢迎使用',
						hint: '建议不超过36个字（支持ID转译），文本通知型卡片本字段非必填，但不可本字段和sub_title_text都不填',
						description: '一级标题，建议不超过36个字，文本通知型卡片本字段非必填，但不可本字段和sub_title_text都不填（支持ID转译）',
					},
					{
						displayName: '副标题',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '点击查看详情',
						hint: '建议不超过44个字（支持ID转译）',
						description: '标题辅助信息，建议不超过44个字（支持ID转译）',
					},
				],
			},
		],
	},
	{
		displayName: '关键数据样式',
		name: 'emphasis_content',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加关键数据',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '可选。关键数据样式',
		options: [
			{
				name: 'emphasisInfo',
				displayName: '关键数据',
				values: [
					{
						displayName: '数据',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '100',
						description: '关键数据内容',
					},
					{
						displayName: '数据描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '已完成',
						description: '数据的描述说明',
					},
				],
			},
		],
	},
	{
		displayName: '引用文献样式',
		name: 'quote_area',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加引用',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '可选。引用文献样式，建议不与关键数据共用',
		options: [
			{
				name: 'quoteInfo',
				displayName: '引用内容',
				values: [
					{
						displayName: '引用类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '无点击事件',
								value: 0,
							},
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '跳转小程序',
								value: 2,
							},
						],
						default: 0,
						hint: '0或不填代表没有点击事件，1代表跳转url，2代表跳转小程序',
						description: '引用文献样式区域点击事件，0或不填代表没有点击事件，1代表跳转URL，2代表跳转小程序',
					},
					{
						displayName: '小程序Appid',
						name: 'appid',
						type: 'string',
						default: '',
						placeholder: 'wx1234567890abcdef',
						displayOptions: {
							show: {
								type: [2],
							},
						},
						hint: '必须是与当前应用关联的小程序',
						description: '点击跳转的小程序的appid，必须是与当前应用关联的小程序，quote_area.type是2时必填',
					},
					{
						displayName: '小程序Page路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						placeholder: 'pages/index',
						displayOptions: {
							show: {
								type: [2],
							},
						},
						description: '点击跳转的小程序的pagepath，quote_area.type是2时选填',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						displayOptions: {
							show: {
								type: [1],
							},
						},
						hint: 'quote_area.type是1时必填',
						description: '点击跳转的URL，quote_area.type是1时必填',
					},
					{
						displayName: '引用标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '引用标题',
						description: '引用文献的标题',
					},
					{
						displayName: '引用文本',
						name: 'quote_text',
						type: 'string',
						typeOptions: {
							rows: 3,
						},
						default: '',
						placeholder: '引用的具体内容',
						description: '引用文献的具体文本内容',
					},
				],
			},
		],
	},
	{
		displayName: '二级普通文本',
		name: 'sub_title_text',
		type: 'string',
		default: '',
		placeholder: '请输入二级文本内容',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		hint: '建议不超过160个字',
		description:
			'可选。二级普通文本（支持ID转译）。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '二级标题+文本列表',
		name: 'horizontal_content_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加列表项',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '可选。二级标题+文本列表，列表长度不超过6',
		options: [
			{
				name: 'items',
				displayName: '列表项',
				values: [
					{
						displayName: '标题',
						name: 'keyname',
						type: 'string',
						required: true,
						default: '',
						placeholder: '姓名',
						hint: '建议不超过5个字',
						description: '二级标题，建议不超过5个字',
					},
					{
						displayName: '内容',
						name: 'value',
						type: 'string',
						default: '',
						placeholder: '张三',
						hint: '如果type是2，该字段代表文件名称（要包含文件类型），建议不超过30个字（支持ID转译）',
						description: '二级文本，如果horizontal_content_list.type是2，该字段代表文件名称（要包含文件类型），建议不超过30个字（支持ID转译）',
					},
					{
						displayName: '链接类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '不是链接',
								value: 0,
							},
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '下载附件',
								value: 2,
							},
							{
								name: '点击跳转成员详情',
								value: 3,
							},
						],
						default: 0,
						hint: '0或不填代表不是链接，1代表跳转url，2代表下载附件，3代表点击跳转成员详情',
						description: '链接类型，0或不填代表不是链接，1代表跳转URL，2代表下载附件，3代表点击跳转成员详情',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						hint: 'horizontal_content_list.type是1时必填',
						description: '链接跳转的URL，horizontal_content_list.type是1时必填',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
					{
						displayName: '附件Media ID',
						name: 'media_id',
						type: 'string',
						default: '',
						placeholder: 'MEDIA_ID',
						hint: 'horizontal_content_list.type是2时必填',
						description: '附件的media_id，horizontal_content_list.type是2时必填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
					{
						displayName: '成员Userid',
						name: 'userid',
						type: 'string',
						default: '',
						placeholder: 'zhangsan',
						hint: 'horizontal_content_list.type是3时必填',
						description: '成员详情的userid，horizontal_content_list.type是3时必填',
						displayOptions: {
							show: {
								type: [3],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: '跳转指引样式列表',
		name: 'jump_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加跳转指引',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '可选。跳转指引样式的列表，列表长度不超过3',
		options: [
			{
				name: 'items',
				displayName: '跳转指引',
				values: [
					{
						displayName: '跳转链接类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '不是链接',
								value: 0,
							},
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '跳转小程序',
								value: 2,
							},
						],
						default: 0,
						hint: '0或不填代表不是链接，1代表跳转url，2代表跳转小程序',
						description: '跳转链接类型，0或不填代表不是链接，1代表跳转URL，2代表跳转小程序',
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
						placeholder: '查看详情',
						hint: '建议不超过18个字',
						description: '跳转链接样式的文案内容，建议不超过18个字',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						hint: 'jump_list.type是1时必填',
						description: '跳转链接的URL，jump_list.type是1时必填',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
					{
						displayName: '小程序Appid',
						name: 'appid',
						type: 'string',
						default: '',
						placeholder: 'wx1234567890abcdef',
						hint: '必须是与当前应用关联的小程序，jump_list.type是2时必填',
						description: '跳转链接的小程序的appid，必须是与当前应用关联的小程序，jump_list.type是2时必填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
					{
						displayName: '小程序Page路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						placeholder: 'pages/index',
						hint: 'jump_list.type是2时选填',
						description: '跳转链接的小程序的pagepath，jump_list.type是2时选填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: '整体卡片点击跳转',
		name: 'card_action',
		type: 'fixedCollection',
		default: {},
		placeholder: '设置卡片跳转',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '整体卡片的点击跳转事件（text_notice必填，news_notice不需要）',
		options: [
			{
				name: 'actionInfo',
				displayName: '跳转设置',
				values: [
					{
						displayName: '跳转事件类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '不是链接',
								value: 0,
							},
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '打开小程序',
								value: 2,
							},
						],
						default: 1,
						hint: 'text_notice必填本字段，取值范围为[1,2]；news_notice必填本字段，取值范围为[1,2]；button_interaction可选，取值范围为[0,1,2]',
						description: '跳转事件类型，1代表跳转URL，2代表打开小程序。text_notice必填本字段，取值范围为[1,2]；news_notice必填本字段，取值范围为[1,2]；button_interaction可选，取值范围为[0,1,2]',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						hint: 'card_action.type是1时必填',
						description: '跳转事件的URL，card_action.type是1时必填',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
					{
						displayName: '小程序Appid',
						name: 'appid',
						type: 'string',
						default: '',
						placeholder: 'wx1234567890abcdef',
						hint: '必须是与当前应用关联的小程序，card_action.type是2时必填',
						description: '跳转事件的小程序的appid，必须是与当前应用关联的小程序，card_action.type是2时必填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
					{
						displayName: '小程序Page路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						placeholder: 'pages/index',
						hint: 'card_action.type是2时选填',
						description: '跳转事件的小程序的pagepath，card_action.type是2时选填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: '任务ID',
		name: 'task_id',
		type: 'string',
		default: '',
		placeholder: 'task_001',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description:
			'可选。任务 ID，同一个应用任务 ID 不能重复，只能由数字、字母和"_-@"组成，最长128字节。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否开启ID转译',
		name: 'enable_id_trans',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		hint: '开启后会将消息中的userid转为@对应成员',
		description:
			'可选。表示是否开启ID转译，0表示否，1表示是，默认0。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '按钮替换文案',
		name: 'replace_text',
		type: 'string',
		default: '',
		placeholder: '已提交',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['button_interaction', 'vote_interaction', 'multiple_interaction'],
			},
		},
		hint: '填写本字段后会展现灰色不可点击按钮',
		description:
			'可选。按钮替换文案，填写本字段后会展现灰色不可点击按钮。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '下拉式选择器',
		name: 'button_selection',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加选择器',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['button_interaction'],
			},
		},
		description: '可选。下拉式的选择器',
		options: [
			{
				name: 'selectionInfo',
				displayName: '选择器信息',
				values: [
					{
						displayName: '选择器Key',
						name: 'question_key',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'btn_question_key1',
						hint: '最长支持1024字节',
						description: '下拉式的选择器的key，用户提交选项后，会产生回调事件，回调事件会带上该key值表示该题，最长支持1024字节',
					},
					{
						displayName: '选择器标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '企业微信评分',
						description: '下拉式的选择器左边的标题',
					},
					{
						displayName: '默认选定ID',
						name: 'selected_id',
						type: 'string',
						default: '',
						placeholder: 'btn_selection_id1',
						hint: '不填或错填默认第一个',
						description: '默认选定的ID，不填或错填默认第一个',
					},
					{
						displayName: '选项列表',
						name: 'option_list',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: '添加选项',
						required: true,
						hint: '下拉选项不超过10个，最少1个',
						description: '选项列表，下拉选项不超过10个，最少1个',
						options: [
							{
								name: 'options',
								displayName: '选项',
								values: [
									{
										displayName: '选项ID',
										name: 'id',
										type: 'string',
										required: true,
										default: '',
										placeholder: 'btn_selection_id1',
										hint: '最长支持128字节，不可重复',
										description: '下拉式的选择器选项的ID，用户提交选项后，会产生回调事件，回调事件会带上该ID值表示该选项，最长支持128字节，不可重复',
									},
									{
										displayName: '选项文案',
										name: 'text',
										type: 'string',
										required: true,
										default: '',
										placeholder: '100分',
										hint: '建议不超过16个字',
										description: '下拉式的选择器选项的文案，建议不超过16个字',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '按钮列表',
		name: 'button_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加按钮',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['button_interaction'],
			},
		},
		hint: '列表长度不超过6',
		description: '按钮列表，列表长度不超过6',
		options: [
			{
				name: 'buttons',
				displayName: '按钮',
				values: [
					{
						displayName: '按钮点击事件类型',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '回调点击事件',
								value: 0,
							},
							{
								name: '跳转URL',
								value: 1,
							},
						],
						default: 0,
						hint: '0或不填代表回调点击事件，1代表跳转url',
						description: '按钮点击事件类型，0或不填代表回调点击事件，1代表跳转URL',
					},
					{
						displayName: '按钮文案',
						name: 'text',
						type: 'string',
						required: true,
						default: '',
						placeholder: '同意',
						hint: '建议不超过10个字',
						description: '按钮文案，建议不超过10个字',
					},
					{
						displayName: '按钮样式',
						name: 'style',
						type: 'options',
						options: [
							{
								name: '样式1',
								value: 1,
							},
							{
								name: '样式2',
								value: 2,
							},
							{
								name: '样式3',
								value: 3,
							},
							{
								name: '样式4',
								value: 4,
							},
						],
						default: 1,
						hint: '目前可填1~4，不填或错填默认1',
						description: '按钮样式，目前可填1~4，不填或错填默认1',
					},
					{
						displayName: '按钮Key',
						name: 'key',
						type: 'string',
						default: '',
						placeholder: 'btn_agree',
						hint: '最长支持1024字节，不可重复，button_list.type是0时必填',
						description: '按钮key值，用户点击后，会产生回调事件将本参数作为EventKey返回，回调事件会带上该key值，最长支持1024字节，不可重复，button_list.type是0时必填',
						displayOptions: {
							show: {
								type: [0],
							},
						},
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						hint: 'button_list.type是1时必填',
						description: '跳转事件的URL，button_list.type是1时必填',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
				],
			},
		],
	},
	{
		displayName: '下拉式选择器列表',
		name: 'select_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加选择器',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['multiple_interaction'],
			},
		},
		hint: 'multiple_interaction类型的卡片该字段不可为空，一个消息最多支持3个选择器',
		description: '下拉式的选择器列表，multiple_interaction类型的卡片该字段不可为空，一个消息最多支持3个选择器',
		options: [
			{
				name: 'selectors',
				displayName: '选择器',
				values: [
					{
						displayName: '题目Key',
						name: 'question_key',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'question_key1',
						hint: '最长支持1024字节，不可重复',
						description: '下拉式的选择器题目的key，用户提交选项后，会产生回调事件，回调事件会带上该key值表示该题，最长支持1024字节，不可重复',
					},
					{
						displayName: '选择器标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '选择器标签',
						description: '下拉式的选择器上面的title',
					},
					{
						displayName: '默认选定ID',
						name: 'selected_id',
						type: 'string',
						default: '',
						placeholder: 'selection_id1',
						hint: '不填或错填默认第一个',
						description: '默认选定的ID，不填或错填默认第一个',
					},
					{
						displayName: '是否可以选择状态',
						name: 'disable',
						type: 'boolean',
						default: false,
						hint: '是否禁用选择器',
						description: '可选。是否可以选择状态',
					},
					{
						displayName: '选项列表',
						name: 'option_list',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: '添加选项',
						required: true,
						hint: '下拉选项不超过10个，最少1个',
						description: '选项列表，下拉选项不超过10个，最少1个',
						options: [
							{
								name: 'options',
								displayName: '选项',
								values: [
									{
										displayName: '选项ID',
										name: 'id',
										type: 'string',
										required: true,
										default: '',
										placeholder: 'selection_id1',
										hint: '最长支持128字节，不可重复',
										description: '下拉式的选择器选项的ID，用户提交选项后，会产生回调事件，回调事件会带上该ID值表示该选项，最长支持128字节，不可重复',
									},
									{
										displayName: '选项文案',
										name: 'text',
										type: 'string',
										required: true,
										default: '',
										placeholder: '选择器选项1',
										hint: '建议不超过16个字',
										description: '下拉式的选择器选项的文案，建议不超过16个字',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '选择题Key值',
		name: 'checkbox_question_key',
		type: 'string',
		default: '',
		placeholder: 'question_001',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['vote_interaction'],
			},
		},
		hint: '最长支持1024字节',
		description:
			'选择题key值，用户提交选项后，会产生回调事件，回调事件会带上该key值表示该题，最长支持1024字节。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '选择题模式',
		name: 'checkbox_mode',
		type: 'options',
		options: [
			{
				name: '单选',
				value: 0,
			},
			{
				name: '多选',
				value: 1,
			},
		],
		default: 0,
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['vote_interaction'],
			},
		},
		hint: '单选：0，多选：1，不填默认0',
		description:
			'可选。选择题模式，单选：0，多选：1，不填默认0。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '是否可以选择状态',
		name: 'checkbox_disable',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['vote_interaction'],
			},
		},
		hint: '是否禁用选择题',
		description: '可选。是否可以选择状态',
	},
	{
		displayName: '选项列表',
		name: 'option_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加选项',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		description: '选项列表，列表长度不超过10',
		options: [
			{
				name: 'options',
				displayName: '选项',
				values: [
					{
						displayName: '选项ID',
						name: 'id',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'option1',
						hint: '最长支持128字节，不可重复',
						description: '选项ID，用户提交选项后，会产生回调事件，回调事件会带上该ID值表示该选项，最长支持128字节，不可重复',
					},
					{
						displayName: '选项文本',
						name: 'text',
						type: 'string',
						required: true,
						default: '',
						placeholder: '选项一',
						hint: '建议不超过17个字（投票选择型）',
						description: '选项文案描述，建议不超过17个字（投票选择型）',
					},
					{
						displayName: '是否默认选中',
						name: 'is_checked',
						type: 'boolean',
						required: true,
						default: false,
						displayOptions: {
							show: {
								'../card_type': ['vote_interaction'],
							},
						},
						hint: '仅投票选择型支持',
						description: '该选项是否要默认选中（仅投票选择型支持）',
					},
				],
			},
		],
	},
	{
		displayName: '提交按钮文案',
		name: 'submit_button_text',
		type: 'string',
		default: '提交',
		placeholder: '提交',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		hint: '建议不超过10个字',
		description:
			'可选。提交按钮文案，不填默认为提交。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '提交按钮Key值',
		name: 'submit_button_key',
		type: 'string',
		default: '',
		placeholder: 'submit_001',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['vote_interaction', 'multiple_interaction'],
			},
		},
		hint: '最长支持1024字节',
		description:
			'提交按钮key值，用户提交选项后，会产生回调事件，回调事件会将本参数作为EventKey返回。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
	{
		displayName: '图片样式',
		name: 'card_image',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加图片',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['news_notice'],
			},
		},
		hint: 'news_notice类型的卡片，card_image和image_text_area两者必填一个字段，不可都不填',
		description: '可选。图片样式，news_notice类型的卡片，card_image和image_text_area两者必填一个字段，不可都不填',
		options: [
			{
				name: 'imageInfo',
				displayName: '图片信息',
				values: [
					{
						displayName: '图片URL',
						name: 'url',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'https://example.com/image.jpg',
						description: '图片的URL',
					},
					{
						displayName: '图片宽高比',
						name: 'aspect_ratio',
						type: 'number',
						default: 1.3,
						typeOptions: {
							minValue: 1.3,
							maxValue: 2.25,
						},
						hint: '宽高比要小于2.25，大于1.3，不填该参数默认1.3',
						description: '图片的宽高比，宽高比要小于2.25，大于1.3，不填该参数默认1.3',
					},
				],
			},
		],
	},
	{
		displayName: '左图右文样式',
		name: 'image_text_area',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加图片',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['news_notice'],
			},
		},
		hint: 'news_notice类型的卡片，card_image和image_text_area两者必填一个字段，不可都不填',
		description: '可选。左图右文样式，news_notice类型的卡片，card_image和image_text_area两者必填一个字段，不可都不填',
		options: [
			{
				name: 'imageTextInfo',
				displayName: '图片内容',
				values: [
					{
						displayName: '左图右文样式区域点击事件',
						name: 'type',
						type: 'options',
						options: [
							{
								name: '无点击事件',
								value: 0,
							},
							{
								name: '跳转URL',
								value: 1,
							},
							{
								name: '跳转小程序',
								value: 2,
							},
						],
						default: 0,
						hint: '0或不填代表没有点击事件，1代表跳转url，2代表跳转小程序',
						description: '左图右文样式区域点击事件，0或不填代表没有点击事件，1代表跳转URL，2代表跳转小程序',
					},
					{
						displayName: '图片链接',
						name: 'image_url',
						type: 'string',
						required: true,
						default: '',
						placeholder: 'https://example.com/image.png',
						description: '左图右文样式的图片URL',
					},
					{
						displayName: '跳转链接',
						name: 'url',
						type: 'string',
						default: '',
						placeholder: 'https://example.com',
						hint: 'image_text_area.type是1时必填',
						description: '点击跳转的URL，image_text_area.type是1时必填',
						displayOptions: {
							show: {
								type: [1],
							},
						},
					},
					{
						displayName: '小程序Appid',
						name: 'appid',
						type: 'string',
						default: '',
						placeholder: 'wx1234567890abcdef',
						hint: '必须是与当前应用关联的小程序，image_text_area.type是2时必填',
						description: '点击跳转的小程序的appid，必须是与当前应用关联的小程序，image_text_area.type是2时必填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
					{
						displayName: '小程序Page路径',
						name: 'pagepath',
						type: 'string',
						default: '',
						placeholder: 'pages/index',
						hint: 'image_text_area.type是2时选填',
						description: '点击跳转的小程序的pagepath，image_text_area.type是2时选填',
						displayOptions: {
							show: {
								type: [2],
							},
						},
					},
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						default: '',
						placeholder: '图片标题',
						description: '图片的标题',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						typeOptions: {
							rows: 2,
						},
						default: '',
						placeholder: '图片描述',
						description: '图片的描述文字',
					},
				],
			},
		],
	},
	{
		displayName: '卡片二级垂直内容',
		name: 'vertical_content_list',
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
		default: {},
		placeholder: '添加垂直内容',
		displayOptions: {
			show: {
				...showOnlyUpdateTemplateCard,
				card_type: ['news_notice'],
			},
		},
		hint: '列表长度不超过4',
		description: '可选。卡片二级垂直内容，该字段可为空数组，但有数据的话需确认对应字段是否必填，列表长度不超过4',
		options: [
			{
				name: 'items',
				displayName: '垂直内容',
				values: [
					{
						displayName: '标题',
						name: 'title',
						type: 'string',
						required: true,
						default: '',
						placeholder: '标题',
						hint: '建议不超过38个字',
						description: '卡片二级标题，建议不超过38个字',
					},
					{
						displayName: '描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '描述',
						hint: '建议不超过160个字',
						description: '二级普通文本，建议不超过160个字',
					},
				],
			},
		],
	},
	{
		displayName: '卡片右上角更多操作按钮',
		name: 'action_menu',
		type: 'fixedCollection',
		default: {},
		placeholder: '添加操作菜单',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description: '可选。卡片右上角更多操作按钮',
		options: [
			{
				name: 'menuInfo',
				displayName: '操作菜单',
				values: [
					{
						displayName: '菜单描述',
						name: 'desc',
						type: 'string',
						default: '',
						placeholder: '更多操作',
						description: '菜单的描述文字',
					},
					{
						displayName: '操作列表',
						name: 'action_list',
						type: 'fixedCollection',
						typeOptions: {
							multipleValues: true,
						},
						default: {},
						placeholder: '添加操作',
						options: [
							{
								name: 'actions',
								displayName: '操作',
								values: [
									{
										displayName: '操作文本',
										name: 'text',
										type: 'string',
										default: '',
										placeholder: '删除',
										description: '操作的文本',
									},
									{
										displayName: '操作Key',
										name: 'key',
										type: 'string',
										default: '',
										placeholder: 'action_delete',
										description: '操作的唯一标识',
									},
								],
							},
						],
					},
				],
			},
		],
	},
	{
		displayName: '更新卡片所需要消费的按钮Key值',
		name: 'button_key',
		type: 'string',
		default: '',
		placeholder: 'btn_001',
		displayOptions: {
			show: showOnlyUpdateTemplateCard,
		},
		description:
			'可选。仅用于任务卡片消息的升级场景，如果需要更新任务卡片消息时需要填写。<a href="https://developer.work.weixin.qq.com/document/path/94888" target="_blank">官方文档</a>',
	},
];
