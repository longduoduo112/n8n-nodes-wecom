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
		hint: '企业应用的id',
		description: '企业应用的唯一标识',
	},
	{
		displayName: '菜单配置（JSON）',
		name: 'button',
		type: 'json',
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
		hint: '一级菜单数组，个数应为1~3个',
		description: `菜单按钮配置数组。支持的按钮类型：
- click: 点击推事件
- view: 跳转URL
- scancode_push: 扫码推事件
- scancode_waitmsg: 扫码推事件且弹出提示框
- pic_sysphoto: 弹出系统拍照发图
- pic_photo_or_album: 弹出拍照或者相册发图
- pic_weixin: 弹出企业微信相册发图器
- location_select: 弹出地理位置选择器
- view_miniprogram: 跳转到小程序。
<a href="https://developer.work.weixin.qq.com/document/path/90231" target="_blank">官方文档</a>`,
	},
];
