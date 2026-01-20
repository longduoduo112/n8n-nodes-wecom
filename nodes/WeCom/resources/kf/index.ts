import type { INodeProperties } from 'n8n-workflow';

// 客服账号管理
import { addKfAccountDescription } from './addKfAccount';
import { delKfAccountDescription } from './delKfAccount';
import { updateKfAccountDescription } from './updateKfAccount';
import { listKfAccountDescription } from './listKfAccount';
import { getKfAccountLinkDescription } from './getKfAccountLink';

// 接待人员管理
import { addServicerDescription } from './addServicer';
import { delServicerDescription } from './delServicer';
import { listServicerDescription } from './listServicer';

// 会话分配与消息收发
import { transServiceStateDescription } from './transServiceState';
import { sendKfMsgDescription } from './sendKfMsg';
import { sendKfEventMsgDescription } from './sendKfEventMsg';
import { syncMsgDescription } from './syncMsg';
import { setUpgradeServiceDescription } from './setUpgradeService';
import { getCustomerInfoDescription } from './getCustomerInfo';

// 统计管理
import { getCorpStatisticDescription } from './getCorpStatistic';
import { getServicerStatisticDescription } from './getServicerStatistic';

// 机器人管理
import { manageKnowledgeGroupDescription } from './manageKnowledgeGroup';
import { manageKnowledgeIntentDescription } from './manageKnowledgeIntent';

const showOnlyForKf = {
	resource: ['kf'],
};

export const kfDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForKf,
		},
		 
		options: [
			// 客服账号管理
			{
				name: '[客服账号管理] 添加客服账号',
				value: 'addKfAccount',
				action: '添加客服账号',
				description: '创建新的客服账号',
			},
			{
				name: '[客服账号管理] 删除客服账号',
				value: 'delKfAccount',
				action: '删除客服账号',
				description: '删除指定的客服账号',
			},
			{
				name: '[客服账号管理] 修改客服账号',
				value: 'updateKfAccount',
				action: '修改客服账号',
				description: '修改客服账号信息',
			},
			{
				name: '[客服账号管理] 获取客服账号列表',
				value: 'listKfAccount',
				action: '获取客服账号列表',
				description: '获取企业的客服账号列表',
			},
			{
				name: '[客服账号管理] 获取客服账号链接',
				value: 'getKfAccountLink',
				action: '获取客服账号链接',
				description: '获取客服账号的会话链接',
			},
			// 接待人员管理
			{
				name: '[接待人员管理] 添加接待人员',
				value: 'addServicer',
				action: '添加接待人员',
				description: '为客服账号添加接待人员',
			},
			{
				name: '[接待人员管理] 删除接待人员',
				value: 'delServicer',
				action: '删除接待人员',
				description: '从客服账号中删除接待人员',
			},
			{
				name: '[接待人员管理] 获取接待人员列表',
				value: 'listServicer',
				action: '获取接待人员列表',
				description: '获取客服账号的接待人员列表',
			},
			// 会话与消息
			{
				name: '[会话与消息] 分配客服会话',
				value: 'transServiceState',
				action: '分配客服会话',
				description: '转接客服会话给其他接待人员',
			},
			{
				name: '[会话与消息] 发送消息',
				value: 'sendKfMsg',
				action: '发送消息',
				description: '发送客服消息给客户',
			},
			{
				name: '[会话与消息] 发送事件响应消息',
				value: 'sendKfEventMsg',
				action: '发送事件响应消息',
				description: '发送事件响应类型的客服消息',
			},
			{
				name: '[会话与消息] 读取消息',
				value: 'syncMsg',
				action: '读取消息',
				description: '同步读取客服会话消息',
			},
			{
				name: '[会话与消息] 设置升级服务配置',
				value: 'setUpgradeService',
				action: '设置升级服务配置',
				description: '设置客服会话的升级服务配置',
			},
			{
				name: '[会话与消息] 获取客户基础信息',
				value: 'getCustomerInfo',
				action: '获取客户基础信息',
				description: '获取客服会话中客户的基础信息',
			},
			// 统计管理
			{
				name: '[统计管理] 获取企业客服数据统计',
				value: 'getCorpStatistic',
				action: '获取企业数据统计',
				description: '获取企业客服的统计数据',
			},
			{
				name: '[统计管理] 获取接待人员数据统计',
				value: 'getServicerStatistic',
				action: '获取接待人员统计',
				description: '获取接待人员的统计数据',
			},
			// 机器人管理
			{
				name: '[机器人管理] 管理知识库分组',
				value: 'manageKnowledgeGroup',
				action: '管理知识库分组',
				description: '管理客服机器人知识库的分组',
			},
			{
				name: '[机器人管理] 管理知识库问答',
				value: 'manageKnowledgeIntent',
				action: '管理知识库问答',
				description: '管理客服机器人知识库的问答内容',
			},
		],
		default: 'listKfAccount',
	},
	// 客服账号管理
	...addKfAccountDescription,
	...delKfAccountDescription,
	...updateKfAccountDescription,
	...listKfAccountDescription,
	...getKfAccountLinkDescription,
	// 接待人员管理
	...addServicerDescription,
	...delServicerDescription,
	...listServicerDescription,
	// 会话分配与消息收发
	...transServiceStateDescription,
	...sendKfMsgDescription,
	...sendKfEventMsgDescription,
	...syncMsgDescription,
	...setUpgradeServiceDescription,
	...getCustomerInfoDescription,
	// 统计管理
	...getCorpStatisticDescription,
	...getServicerStatisticDescription,
	// 机器人管理
	...manageKnowledgeGroupDescription,
	...manageKnowledgeIntentDescription,
];

