import type { INodeProperties } from 'n8n-workflow';
import { getFileOperRecordDescription } from './getFileOperRecord';
import { importDeviceDescription } from './importDevice';
import { getDeviceListDescription } from './getDeviceList';
import { getDeviceByUserDescription } from './getDeviceByUser';
import { deleteDeviceDescription } from './deleteDevice';
import { approveDeviceDescription } from './approveDevice';
import { rejectDeviceDescription } from './rejectDevice';
import { getScreenOperRecordDescription } from './getScreenOperRecord';
import { submitBatchAddVipJobDescription } from './submitBatchAddVipJob';
import { batchAddVipJobResultDescription } from './batchAddVipJobResult';
import { submitBatchDelVipJobDescription } from './submitBatchDelVipJob';
import { batchDelVipJobResultDescription } from './batchDelVipJobResult';
import { getVipListDescription } from './getVipList';
import { getMemberOperLogDescription } from './getMemberOperLog';
import { getAdminOperLogDescription } from './getAdminOperLog';
import { getServerDomainIpDescription } from './getServerDomainIp';

const showOnlyForSecurity = {
	resource: ['security'],
};

export const securityDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSecurity,
		},
		options: [
			{
				name: '[文件防泄漏] 获取文件操作记录',
				value: 'getFileOperRecord',
				action: '获取文件操作记录',
				description: '查询文件上传、下载、转发等操作记录',
			},
			{
				name: '[设备管理] 导入可信企业设备',
				value: 'importDevice',
				action: '导入可信企业设备',
				description: '导入可信企业设备（Windows/Mac）',
			},
			{
				name: '[设备管理] 获取设备信息',
				value: 'getDeviceList',
				action: '获取设备列表',
				description: '获取可信企业设备、未知设备或可信个人设备列表',
			},
			{
				name: '[设备管理] 获取成员使用设备',
				value: 'getDeviceByUser',
				action: '获取成员使用设备',
				description: '获取指定成员使用的设备列表',
			},
			{
				name: '[设备管理] 删除设备',
				value: 'deleteDevice',
				action: '删除设备',
				description: '删除指定的设备',
			},
			{
				name: '[设备管理] 确认可信设备',
				value: 'approveDevice',
				action: '确认可信设备',
				description: '确认为可信企业设备或可信个人设备',
			},
			{
				name: '[设备管理] 驳回可信设备申请',
				value: 'rejectDevice',
				action: '驳回可信设备申请',
				description: '驳回未知设备的可信申请',
			},
			{
				name: '[截屏/录屏管理] 获取截屏操作记录',
				value: 'getScreenOperRecord',
				action: '获取截屏操作记录',
				description: '查询截屏操作记录',
			},
			{
				name: '[高级功能账号管理] 获取高级功能账号列表',
				value: 'getVipList',
				action: '获取高级功能账号列表',
				description: '查询企业已分配高级功能且在应用可见范围的账号列表',
			},
			{
				name: '[高级功能账号管理] 分配高级功能账号',
				value: 'submitBatchAddVipJob',
				action: '分配高级功能账号',
				description: '分配应用可见范围内企业成员的高级功能',
			},
			{
				name: '[高级功能账号管理] 查询分配高级功能账号结果',
				value: 'batchAddVipJobResult',
				action: '查询分配高级功能账号结果',
				description: '查询批量分配高级功能的任务执行结果',
			},
			{
				name: '[高级功能账号管理] 取消高级功能账号',
				value: 'submitBatchDelVipJob',
				action: '取消高级功能账号',
				description: '撤销分配应用可见范围企业成员的高级功能',
			},
			{
				name: '[高级功能账号管理] 查询取消高级功能账号结果',
				value: 'batchDelVipJobResult',
				action: '查询取消高级功能账号结果',
				description: '查询批量取消高级功能的任务执行结果',
			},
			{
				name: '[操作日志] 获取成员操作记录',
				value: 'getMemberOperLog',
				action: '获取成员操作记录',
				description: '读取成员操作记录（添加/删除外部联系人、标记企业客户、新设备登录等）',
			},
			{
				name: '[操作日志] 获取管理端操作日志',
				value: 'getAdminOperLog',
				action: '获取管理端操作日志',
				description: '读取管理端操作日志（权限管理变更、成员与部门变更、应用变更等）',
			},
			{
				name: '[基础] 获取企业微信域名IP信息',
				value: 'getServerDomainIp',
				action: '获取企业微信域名IP信息',
				description: '获取企业微信最新的域名和IP信息，用于网络配置和防火墙设置',
			},
		],
		default: 'getFileOperRecord',
	},
	...getFileOperRecordDescription,
	...importDeviceDescription,
	...getDeviceListDescription,
	...getDeviceByUserDescription,
	...deleteDeviceDescription,
	...approveDeviceDescription,
	...rejectDeviceDescription,
	...getScreenOperRecordDescription,
	...getVipListDescription,
	...submitBatchAddVipJobDescription,
	...batchAddVipJobResultDescription,
	...submitBatchDelVipJobDescription,
	...batchDelVipJobResultDescription,
	...getMemberOperLogDescription,
	...getAdminOperLogDescription,
	...getServerDomainIpDescription,
];
