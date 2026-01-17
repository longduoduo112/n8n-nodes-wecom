import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['wefile'], operation: ['spaceSecuritySettings'] };

export const spaceSecuritySettingsDescription: INodeProperties[] = [
	{
		displayName: '空间ID',
		name: 'spaceId',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '微盘空间的ID',
	},
	{
		displayName: '启用水印',
		name: 'enableWatermark',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否启用水印保护',
	},
	{
		displayName: '仅管理员可添加成员',
		name: 'addMemberOnlyAdmin',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '是否仅管理员可以添加成员',
	},
	{
		displayName: '允许分享链接',
		name: 'enableShareUrl',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: true,
		description: '是否允许通过链接分享',
	},
	{
		displayName: '分享链接无需审批',
		name: 'shareUrlNoApprove',
		type: 'boolean',
		displayOptions: { show: showOnly },
		default: false,
		description: '分享链接是否无需审批',
	},
];
