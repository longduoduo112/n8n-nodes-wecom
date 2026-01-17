import type { INodeProperties } from 'n8n-workflow';

const showOnlyCreateMenu = {
	resource: ['agent'],
	operation: ['createMenu'],
};

export const createMenuDescription: INodeProperties[] = [
	{
		displayName: '应用ID',
		name: 'agentid',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: {
			show: showOnlyCreateMenu,
		},
		description: '企业应用的唯一标识，整型。可在应用的设置页面查看。<a href="https://developer.work.weixin.qq.com/document/path/90231" target="_blank">官方文档</a>',
	},
	{
		displayName: '菜单配置（JSON）',
		name: 'button',
		type: 'json',
		typeOptions: {
			rows: 10,
		},
		required: true,
		default: `[
  {
    "type": "click",
    "name": "今日歌曲",
    "key": "V1001_TODAY_MUSIC"
  },
  {
    "name": "菜单",
    "sub_button": [
      {
        "type": "view",
        "name": "搜索",
        "url": "https://www.example.com/"
      },
      {
        "type": "click",
        "name": "赞一下我们",
        "key": "V1001_GOOD"
      }
    ]
  }
]`,
		displayOptions: {
			show: showOnlyCreateMenu,
		},
		description: '菜单按钮配置数组。一级菜单数组，个数应为1~3个。每个菜单项包含：type（必填，菜单响应动作类型）、name（必填，主菜单不超过16字节，子菜单不超过40字节）、key（click等点击类型必填，不超过128字节）、URL（view类型必填，不超过1024字节）、pagepath和appid（view_miniprogram类型必填）。二级菜单sub_button数组个数应为1~5个',
	},
];
