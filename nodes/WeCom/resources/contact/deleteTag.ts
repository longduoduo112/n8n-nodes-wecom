import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDeleteTag = {
	resource: ['contact'],
	operation: ['deleteTag'],
};

export const deleteTagDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForDeleteTag,
		},
		default: '',
		placeholder: '12',
		description: '标签ID。调用的应用必须是指定标签的创建者。<a href="https://developer.work.weixin.qq.com/document/path/90212" target="_blank">官方文档</a>',
		hint: '要删除的标签 ID，删除后不可恢复',
	},
];

