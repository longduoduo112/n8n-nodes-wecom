import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['getLivingWatchStat'] };

export const getLivingWatchStatDescription: INodeProperties[] = [
	{
		displayName: '直播ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'livingid',
	},
	{
		displayName: '下一页Key',
		name: 'next_key',
		type: 'string',
		displayOptions: { show: showOnly },
		default: '',
		description: '上一次调用返回的next_key，首次可不填',
	},
];
