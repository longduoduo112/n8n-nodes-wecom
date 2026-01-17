import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['wedoc'],
	operation: ['getSmartsheetGroupChatList'],
};

export const getSmartsheetGroupChatListDescription: INodeProperties[] = [
	{
		displayName: '智能表格ID',
		name: 'docid',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'DOCID',
		required: true,
		description: '必填。智能表格ID，需为当前应用创建的智能表格',
	},
	{
		displayName: '游标',
		name: 'cursor',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'CURSOR',
		description: '用于分页查询的游标。可选。用于分页查询的游标，字符串类型，由上一次调用返回，首次调用可不填',
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: showOnly,
		},
		default: 100,
		typeOptions: {
			minValue: 1,
			maxValue: 200,
		},
		description: '用于分页查询，每次请求返回的数据上限。可选。用于分页查询，每次请求返回的数据上限。默认100，最大200。注意：不保证每次返回的数据刚好为指定limit，必须用返回的has_more判断是否继续请求',
	},
];
