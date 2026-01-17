import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateTag = {
	resource: ['contact'],
	operation: ['updateTag'],
};

export const updateTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateTag,
		},
		default: '',
		placeholder: '12',
		description: '标签ID。调用的应用必须是指定标签的创建者。<a href="https://developer.work.weixin.qq.com/document/path/90211" target="_blank">官方文档</a>',
	},
	{
		displayName: '标签名称',
		name: 'tagname',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateTag,
		},
		default: '',
		placeholder: 'UI design',
		description: '标签名称，长度限制为32个字（汉字或英文字母），标签不可与其他标签重名。调用的应用必须是指定标签的创建者。<a href="https://developer.work.weixin.qq.com/document/path/90211" target="_blank">官方文档</a>',
	},
];

