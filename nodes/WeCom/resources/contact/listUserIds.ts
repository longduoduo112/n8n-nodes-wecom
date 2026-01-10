import type { INodeProperties } from 'n8n-workflow';

const showOnlyListUserIds = {
	resource: ['contact'],
	operation: ['listUserIds'],
};

export const listUserIdsDescription: INodeProperties[] = [
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: {
			show: showOnlyListUserIds,
		},
		placeholder: 'xxxxxxx',
		description: '可选。用于分页查询的游标，字符串类型，由上一次调用返回，首次调用不填。如果该字段返回空则表示已没有更多数据。<a href="https://developer.work.weixin.qq.com/document/path/96067" target="_blank">官方文档</a>',
		hint: '分页游标，首次调用不填，后续调用填上次返回的 next_cursor',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		default: 1000,
		displayOptions: {
			show: showOnlyListUserIds,
		},
		hint: '预期请求的数据量，取值范围 1 ~ 10000',
		description: '可选。分页，预期请求的数据量，取值范围 1 ~ 10000。获取企业成员的userid与对应的部门ID列表。仅支持通过"通讯录同步secret"调用。为保障企业数据安全，应用应当尽量减少通过服务端接口获取通讯录信息，尤其是成员的敏感字段。<a href="https://developer.work.weixin.qq.com/document/path/96067" target="_blank">官方文档</a>',
		typeOptions: {
			minValue: 1,
			maxValue: 10000,
		},
	},
];

