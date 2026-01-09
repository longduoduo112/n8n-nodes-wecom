import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['updateJoinWay'],
};

export const updateJoinWayDescription: INodeProperties[] = [
	{
		displayName: '配置ID',
		name: 'config_id',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '企业联系方式的配置ID',
		placeholder: '9ad7fa5cdaa6511298498f979c4722de',
	},
	{
		displayName: '场景',
		name: 'scene',
		type: 'options',
		options: [
			{
				name: '群的小程序插件',
				value: 1,
			},
			{
				name: '群的二维码插件',
				value: 2,
			},
		],
		required: true,
		default: 2,
		displayOptions: { show: showOnly },
		description: '加入群聊的场景类型。1-群的小程序插件；2-群的二维码插件',
	},
	{
		displayName: '群聊ID列表',
		name: 'chat_id_list',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '使用该配置的客户群ID列表，多个群ID用逗号分隔，最多支持5个。注意：使用覆盖的方式更新',
		placeholder: 'wrOgQhDgAAH2Yy-CTZ6POca8mlBEdaaa,wrOgQhDgAALPUthpRAKvl7mgiQRw_aaa',
	},
	{
		displayName: '备注',
		name: 'remark',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '联系方式的备注信息，用于助记，超过30个字符将被截断',
		placeholder: 'bb_remark',
	},
	{
		displayName: '自动创建群',
		name: 'auto_create_room',
		type: 'boolean',
		default: true,
		displayOptions: { show: showOnly },
		description: '当群满了后，是否自动新建群。默认为是',
	},
	{
		displayName: '群名前缀',
		name: 'room_base_name',
		type: 'string',
		default: '',
		displayOptions: { show: { ...showOnly, auto_create_room: [true] } },
		description: '自动建群的群名前缀，当auto_create_room为1时有效。最长40个utf8字符',
		placeholder: '销售客服群',
	},
	{
		displayName: '群起始序号',
		name: 'room_base_id',
		type: 'number',
		default: 1,
		displayOptions: { show: { ...showOnly, auto_create_room: [true] } },
		description: '自动建群的群起始序号，当auto_create_room为1时有效',
	},
	{
		displayName: '自定义State参数',
		name: 'state',
		type: 'string',
		default: '',
		displayOptions: { show: showOnly },
		description: '企业自定义的state参数，用于区分不同的入群渠道。不超过30个UTF-8字符',
		placeholder: 'klsdup3kj3s1',
	},
	{
		displayName: '标记客户来源',
		name: 'mark_source',
		type: 'boolean',
		default: true,
		displayOptions: { show: showOnly },
		description: '是否标记客户添加来源为该应用创建的「加入群聊」，仅对「营销获客」应用生效，且只能由创建此二维码的应用更新',
	},
];
