import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['kf'], operation: ['setUpgradeService'] };

export const setUpgradeServiceDescription: INodeProperties[] = [
	{
		displayName: '客服账号 Name or ID',
		name: 'open_kfid',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'getKfAccounts',
		},
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '客服账号的唯一标识ID',
		placeholder: 'wkxxxxxxxxxxxxxxxxxx',
	},
	{
		displayName: '升级类型',
		name: 'upgradeType',
		type: 'options',
		required: true,
		displayOptions: { show: showOnly },
		options: [
			{ name: '升级到专员', value: 'member', description: '将会话升级到指定专员' },
			{ name: '升级到客户群', value: 'groupchat', description: '将会话升级到客户群' },
		],
		default: 'member',
		description: '选择升级服务的类型',
	},
	{
		displayName: '专员列表',
		name: 'memberCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, upgradeType: ['member'] } },
		default: {},
		placeholder: '添加专员',
		typeOptions: { multipleValues: true },
		description: '可升级到的专员UserID列表',
		options: [
			{
				displayName: '专员',
				name: 'members',
				values: [
					{
						displayName: '专员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '专员的企业微信UserID',
					},
				],
			},
		],
	},
	{
		displayName: '客户群列表',
		name: 'groupchatCollection',
		type: 'fixedCollection',
		displayOptions: { show: { ...showOnly, upgradeType: ['groupchat'] } },
		default: {},
		placeholder: '添加客户群',
		typeOptions: { multipleValues: true },
		description: '可升级到的客户群ID列表',
		options: [
			{
				displayName: '客户群',
				name: 'groups',
				values: [
					{
						displayName: '群聊ID',
						name: 'chat_id',
						type: 'string',
						default: '',
						required: true,
						description: '客户群的chat_id',
					},
				],
			},
		],
	},
];
