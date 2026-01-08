import type { INodeProperties } from 'n8n-workflow';

const showOnlySetWorkbenchData = {
	resource: ['agent'],
	operation: ['setWorkbenchData'],
};

export const setWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlySetWorkbenchData,
		},
		description: '企业应用的唯一标识',
	},
	{
		displayName: '用户ID',
		name: 'userid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlySetWorkbenchData,
		},
		description: '需要设置的用户的userid',
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
			},
			{
				name: '图片型',
				value: 'image',
			},
			{
				name: '列表型',
				value: 'list',
			},
			{
				name: 'Webview型',
				value: 'webview',
			},
		],
		default: 'keydata',
		displayOptions: {
			show: showOnlySetWorkbenchData,
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
    }
  ]
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchData,
				type: ['keydata'],
			},
		},
		description: '关键数据型模版数据',
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
				...showOnlySetWorkbenchData,
				type: ['image'],
			},
		},
		description: '图片型模版数据',
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
    }
  ]
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchData,
				type: ['list'],
			},
		},
		description: '列表型模版数据',
	},
	{
		displayName: 'Webview型配置（JSON）',
		name: 'webview',
		type: 'json',
		default: `{
  "url": "http://www.example.com",
  "jump_url": "http://www.example.com"
}`,
		displayOptions: {
			show: {
				...showOnlySetWorkbenchData,
				type: ['webview'],
			},
		},
		description: 'Webview型模版数据',
	},
];
