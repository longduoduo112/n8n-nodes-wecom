import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['wedoc'],
	operation: ['getSmartsheetGroupChat'],
};

export const getSmartsheetGroupChatDescription: INodeProperties[] = [
	{
		displayName: '智能表格ID',
		name: 'docid',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'DOCID',
		required: true,
		description: '必填。智能表格ID，需为当前应用创建的智能表格',
	},
	{
		displayName: '群聊ID',
		name: 'chat_id',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		placeholder: 'CHATID',
		required: true,
		description: '必填。群聊ID，需为智能表自动规则创建群聊ID',
	},
];
