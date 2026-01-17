import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getJoinWay'],
};

export const getJoinWayDescription: INodeProperties[] = [
	{
		displayName: '配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: {
			show: showOnly,
		},
		description: '加入群聊的配置ID。加入群聊的配置ID',
	},
];

