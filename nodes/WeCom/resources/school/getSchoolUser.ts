import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['getSchoolUser'],
};

export const getSchoolUserDescription: INodeProperties[] = [
	{
		displayName: 'UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '家校通讯录的userid，家长或者学生的userid',
	},
];
