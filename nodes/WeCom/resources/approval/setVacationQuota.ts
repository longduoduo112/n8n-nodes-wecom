import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSetVacationQuota = {
	resource: ['approval'],
	operation: ['setVacationQuota'],
};

export const setVacationQuotaDescription: INodeProperties[] = [
	{
		displayName: '成员UserID',
		name: 'userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '要修改假期余额的成员UserID',
	},
	{
		displayName: '假期配置ID',
		name: 'vacation_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '假期类型的配置ID，可通过获取假期配置接口获取',
	},
	{
		displayName: '剩余假期时长',
		name: 'leftduration',
		type: 'number',
		required: true,
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: 0,
		description: '剩余假期时长（秒），用于设置成员的假期余额',
	},
	{
		displayName: '备注',
		name: 'remarks',
		type: 'string',
		displayOptions: {
			show: showOnlyForSetVacationQuota,
		},
		default: '',
		description: '修改假期余额的备注说明',
	},
];

