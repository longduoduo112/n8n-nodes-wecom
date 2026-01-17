import type { INodeProperties } from 'n8n-workflow';

const showOnlyBatchSetWorkbenchData = {
	resource: ['agent'],
	operation: ['batchSetWorkbenchData'],
};

export const batchSetWorkbenchDataDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlyBatchSetWorkbenchData,
		},
		description: '企业应用的唯一标识',
	},
	{
		displayName: '用户ID列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnlyBatchSetWorkbenchData,
		},
		description: '需要设置的用户userid列表，用逗号分隔。多个用户ID用逗号分隔，最多1000个',
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
			show: showOnlyBatchSetWorkbenchData,
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
				...showOnlyBatchSetWorkbenchData,
				type: ['keydata'],
			},
		},
		description: '关键数据型模版数据。items数组不超过4个',
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
				...showOnlyBatchSetWorkbenchData,
				type: ['image'],
			},
		},
		description: '图片型模版数据。图片最佳比例为3.35:1',
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
				...showOnlyBatchSetWorkbenchData,
				type: ['list'],
			},
		},
		description: '列表型模版数据。items数组不超过3个',
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
				...showOnlyBatchSetWorkbenchData,
				type: ['webview'],
			},
		},
		description: 'Webview型模版数据。height可选single_row或double_row',
	},
];
