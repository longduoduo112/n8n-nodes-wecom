import type { INodeProperties } from 'n8n-workflow';

import { createLivingDescription } from './createLiving';
import { modifyLivingDescription } from './modifyLiving';
import { cancelLivingDescription } from './cancelLiving';
import { deleteLivingReplayDataDescription } from './deleteLivingReplayData';
import { getLivingShareInfoDescription } from './getLivingShareInfo';
import { getUserAllLivingIdDescription } from './getUserAllLivingId';
import { getLivingInfoDescription } from './getLivingInfo';
import { getLivingWatchStatDescription } from './getLivingWatchStat';
import { getLivingCodeDescription } from './getLivingCode';

const showOnlyForLive = {
	resource: ['live'],
};

export const liveDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForLive,
		},
		options: [
			{
				name: '创建预约直播',
				value: 'createLiving',
				action: '创建预约直播',
				description: '创建一个预约直播',
			},
			{
				name: '修改预约直播',
				value: 'modifyLiving',
				action: '修改预约直播',
				description: '修改已创建的预约直播信息',
			},
			{
				name: '取消预约直播',
				value: 'cancelLiving',
				action: '取消预约直播',
				description: '取消已创建的预约直播',
			},
			{
				name: '删除直播回放',
				value: 'deleteLivingReplayData',
				action: '删除直播回放',
				description: '删除指定直播的回放视频',
			},
			{
				name: '获取直播分享信息',
				value: 'getLivingShareInfo',
				action: '获取直播分享信息',
				description: '获取在微信中观看直播或回放的链接',
			},
			{
				name: '获取成员直播ID列表',
				value: 'getUserAllLivingId',
				action: '获取成员直播ID列表',
				description: '获取指定成员创建的直播ID列表',
			},
			{
				name: '获取直播详情',
				value: 'getLivingInfo',
				action: '获取直播详情',
				description: '根据直播ID获取直播的详细信息',
			},
			{
				name: '获取直播观看明细',
				value: 'getLivingWatchStat',
				action: '获取直播观看明细',
				description: '获取指定直播的观看统计数据和明细',
			},
			{
				name: '获取直播观众临时码',
				value: 'getLivingCode',
				action: '获取直播观众临时码',
				description: '获取跳转小程序商城的直播观众信息',
			},
		],
		default: 'createLiving',
	},
	...createLivingDescription,
	...modifyLivingDescription,
	...cancelLivingDescription,
	...deleteLivingReplayDataDescription,
	...getLivingShareInfoDescription,
	...getUserAllLivingIdDescription,
	...getLivingInfoDescription,
	...getLivingWatchStatDescription,
	...getLivingCodeDescription,
];
