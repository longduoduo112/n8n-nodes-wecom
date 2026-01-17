import type { INodeProperties } from 'n8n-workflow';

const showOnlySetWorkbenchTemplate = {
	resource: ['agent'],
	operation: ['setWorkbenchTemplate'],
};

export const setWorkbenchTemplateDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlySetWorkbenchTemplate,
		},
		description: '企业应用的唯一标识',
	},
	{
		displayName: '模版类型',
		name: 'type',
		type: 'options',
		required: true,
		options: [
			{
				name: '关键数据型',
				value: 'keydata',
				description: '展示关键数据，最多4项',
			},
			{
				name: '图片型',
				value: 'image',
				description: '展示图片，最佳比例3.35:1',
			},
			{
				name: '列表型',
				value: 'list',
				description: '展示列表，最多3项',
			},
			{
				name: 'Webview型',
				value: 'webview',
				description: '嵌入网页展示',
			},
			{
				name: '普通模式',
				value: 'normal',
				description: '取消自定义模式，改为普通展示模式',
			},
		],
		default: 'keydata',
		displayOptions: {
			show: showOnlySetWorkbenchTemplate,
		},
		description: '工作台展示模版类型',
	},
	{
		displayName: '关键数据型配置（JSON）',
		name: 'keydata',
		type: 'json',
		default: `{
  "items": [
    {
      "key": "待审批",
      "data": "2",
      "jump_url": "http://www.example.com"
    },
    {
      "key": "待处理",
      "data": "4",
      "jump_url": "http://www.example.com"
    }
  ]
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['keydata'],
			},
		},
		description: '关键数据型模版数据。items数组不超过4个。items.key为数据名称，items.data为数据值，items.jump_url为跳转URL，items.pagepath为小程序页面路径',
	},
	{
		displayName: '图片型配置（JSON）',
		name: 'image',
		type: 'json',
		default: `{
  "url": "https://example.com/image.png",
  "jump_url": "http://www.example.com"
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['image'],
			},
		},
		description: '图片型模版数据。图片最佳比例为3.35:1。URL为图片地址，jump_url为跳转URL，pagepath为小程序页面路径',
	},
	{
		displayName: '列表型配置（JSON）',
		name: 'list',
		type: 'json',
		default: `{
  "items": [
    {
      "title": "标题1",
      "jump_url": "http://www.example.com"
    },
    {
      "title": "标题2",
      "jump_url": "http://www.example.com"
    }
  ]
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['list'],
			},
		},
		description: '列表型模版数据。items数组不超过3个。items.title为显示文字，items.jump_url为跳转URL，items.pagepath为小程序页面路径',
	},
	{
		displayName: 'Webview型配置（JSON）',
		name: 'webview',
		type: 'json',
		default: `{
  "url": "http://www.example.com",
  "jump_url": "http://www.example.com",
  "height": "double_row",
  "hide_title": false,
  "enable_webview_click": false
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['webview'],
			},
		},
		description: 'Webview型模版数据。height可选single_row或double_row。URL为渲染展示的URL，jump_url为跳转URL，height为高度，hide_title是否隐藏标题，enable_webview_click是否开启链接跳转',
	},
	{
		displayName: '覆盖用户数据',
		name: 'replace_user_data',
		type: 'boolean',
		default: false,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchTemplate,
				type: ['keydata', 'image', 'list', 'webview'],
			},
		},
		description: '是否覆盖企业所有用户当前设置的数据',
	},
];
