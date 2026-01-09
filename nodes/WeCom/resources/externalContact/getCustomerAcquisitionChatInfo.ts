import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getCustomerAcquisitionChatInfo'],
};

export const getCustomerAcquisitionChatInfoDescription: INodeProperties[] = [
	{
		displayName: '会话信息凭据',
		name: 'chat_key',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '成员多次收消息事件中回调的会话信息凭据ChatKey，回调后30分钟内有效',
		placeholder: 'CHAT_KEY',
	},
];
