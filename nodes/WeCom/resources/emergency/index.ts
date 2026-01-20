import type { INodeProperties } from 'n8n-workflow';

import { makeVoiceCallDescription } from './makeVoiceCall';
import { getCallStatusDescription } from './getCallStatus';

const showOnlyForEmergency = {
	resource: ['emergency'],
};

export const emergencyDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForEmergency,
		},
		options: [
			{
				name: '[紧急通知] 发起语音电话',
				value: 'makeVoiceCall',
				action: '发起语音电话',
				description: '发起紧急通知语音电话',
			},
			{
				name: '[紧急通知] 获取接听状态',
				value: 'getCallStatus',
				action: '获取接听状态',
				description: '获取语音电话的接听状态',
			},
		],
		default: 'makeVoiceCall',
	},
	...makeVoiceCallDescription,
	...getCallStatusDescription,
];

