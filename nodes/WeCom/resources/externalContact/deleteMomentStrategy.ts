import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['deleteMomentStrategy'],
};

export const deleteMomentStrategyDescription: INodeProperties[] = [
	{
		displayName: '规则组ID',
		name: 'strategy_id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
	},
];
