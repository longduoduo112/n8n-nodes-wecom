import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getUserInfo3rd'],
};

export const getUserInfo3rdDescription: INodeProperties[] = [
	{
		displayName: 'Suite Access Token',
		name: 'suiteAccessToken',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '第三方应用的suite_access_token',
	},
	{
		displayName: '授权码',
		name: 'code',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '通过成员授权获取到的code，最大为512字节',
	},
];
