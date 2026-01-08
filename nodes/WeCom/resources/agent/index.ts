import type { INodeProperties } from 'n8n-workflow';
import { getAgentDescription } from './getAgent';
import { listAgentsDescription } from './listAgents';
import { setAgentDescription } from './setAgent';
import { createMenuDescription } from './createMenu';
import { getMenuDescription } from './getMenu';
import { deleteMenuDescription } from './deleteMenu';
import { setWorkbenchTemplateDescription } from './setWorkbenchTemplate';
import { getWorkbenchTemplateDescription } from './getWorkbenchTemplate';
import { setWorkbenchDataDescription } from './setWorkbenchData';
import { batchSetWorkbenchDataDescription } from './batchSetWorkbenchData';
import { getWorkbenchDataDescription } from './getWorkbenchData';

const showOnlyForAgent = {
	resource: ['agent'],
};

export const agentDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForAgent,
		},
		options: [
			{
				name: '获取应用',
				value: 'getAgent',
				action: '获取应用',
				description: '获取指定的应用详情',
			},
			{
				name: '获取应用列表',
				value: 'listAgents',
				action: '获取应用列表',
				description: '获取access_token对应的应用列表',
			},
			{
				name: '设置应用',
				value: 'setAgent',
				action: '设置应用',
				description: '设置应用的基本信息',
			},
			{
				name: '创建菜单',
				value: 'createMenu',
				action: '创建菜单',
				description: '创建应用自定义菜单',
			},
			{
				name: '获取菜单',
				value: 'getMenu',
				action: '获取菜单',
				description: '获取应用的菜单配置',
			},
			{
				name: '删除菜单',
				value: 'deleteMenu',
				action: '删除菜单',
				description: '删除应用的菜单配置',
			},
			{
				name: '设置工作台模版',
				value: 'setWorkbenchTemplate',
				action: '设置工作台模版',
				description: '设置应用在工作台展示的模版类型和默认数据',
			},
			{
				name: '获取工作台模版',
				value: 'getWorkbenchTemplate',
				action: '获取工作台模版',
				description: '获取应用在工作台展示的模版配置',
			},
			{
				name: '设置用户工作台数据',
				value: 'setWorkbenchData',
				action: '设置用户工作台数据',
				description: '设置应用在用户工作台展示的数据',
			},
			{
				name: '批量设置用户工作台数据',
				value: 'batchSetWorkbenchData',
				action: '批量设置用户工作台数据',
				description: '批量设置应用在用户工作台展示的数据',
			},
			{
				name: '获取用户工作台数据',
				value: 'getWorkbenchData',
				action: '获取用户工作台数据',
				description: '获取应用在用户工作台展示的数据',
			},
		],
		default: 'getAgent',
	},
	...getAgentDescription,
	...listAgentsDescription,
	...setAgentDescription,
	...createMenuDescription,
	...getMenuDescription,
	...deleteMenuDescription,
	...setWorkbenchTemplateDescription,
	...getWorkbenchTemplateDescription,
	...setWorkbenchDataDescription,
	...batchSetWorkbenchDataDescription,
	...getWorkbenchDataDescription,
];
