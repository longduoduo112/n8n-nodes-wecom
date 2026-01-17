import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['deallocateAdvancedAccount'] };
export const deallocateAdvancedAccountDescription: INodeProperties[] = [
	{
		displayName: 'UserID列表',
		name: 'userid_list',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '成员userid列表，多个用逗号分隔。最多支持100个。UserID列表，用逗号分隔',
		placeholder: '如: user1,user2,user3',
	},
];
