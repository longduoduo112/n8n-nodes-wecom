import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetDeptDetail = {
	resource: ['contact'],
	operation: ['getDepartmentDetail'],
};

export const getDepartmentDetailDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetDeptDetail,
		},
		default: '',
		placeholder: '2',
		hint: '部门ID，获取指定部门的详细信息',
	},
];

