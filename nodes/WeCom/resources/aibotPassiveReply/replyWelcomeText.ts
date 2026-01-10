import type { INodeProperties } from 'n8n-workflow';

const showOnlyForReplyWelcomeText = {
	resource: ['aibotPassiveReply'],
	operation: ['replyWelcome'],
	replyType: ['text'],
};

export const replyWelcomeTextDescription: INodeProperties[] = [
	{
		displayName: '文本内容',
		name: 'content',
		type: 'string',
		typeOptions: {
			rows: 4,
		},
		displayOptions: {
			show: showOnlyForReplyWelcomeText,
		},
		default: '',
		placeholder: 'hello\nI\'m RobotA',
		required: true,
		hint: '必填。文本内容，支持换行符\\n',
	},
];
