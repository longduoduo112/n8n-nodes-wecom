import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentStrategyRange'],
};

export const getMomentStrategyRangeDescription: INodeProperties[] = [
	{
		displayName: '规则组ID',
		name: 'strategy_id',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: showOnly },
	},
	{
		displayName: '分页游标',
		name: 'cursor',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
	},
	{
		displayName: '每页数量',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 1000 },
		default: 1000,
		displayOptions: { show: showOnly },
		description: '每个分页的成员/部门节点数，默认为1000，最大为1000',
	},
];
