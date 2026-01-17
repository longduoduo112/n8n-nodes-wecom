import type { INodeProperties } from 'n8n-workflow';

const showOnlyGetTagList = {
	resource: ['contact'],
	operation: ['getTagList'],
};

export const getTagListDescription: INodeProperties[] = [
	{
		displayName: '标签类型',
		name: 'tag_type',
		type: 'options',
		options: [
			{
				name: '全部标签',
				value: '',
			},
			{
				name: '个人标签',
				value: 'person',
			},
			{
				name: '部门标签',
				value: 'department',
			},
		],
		default: '',
		displayOptions: {
			show: showOnlyGetTagList,
		},
		description: '可选。标签类型：不填则获取全部标签，person-个人标签，department-部门标签。自建应用或通讯同步助手可以获取所有标签列表；第三方应用仅可获取自己创建的标签。<a href="https://developer.work.weixin.qq.com/document/path/90216" target="_blank">官方文档</a>',
	},
];

