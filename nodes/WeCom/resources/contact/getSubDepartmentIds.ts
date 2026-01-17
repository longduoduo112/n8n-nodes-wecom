import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetSubDept = {
	resource: ['contact'],
	operation: ['getSubDepartmentIds'],
};

export const getSubDepartmentIdsDescription: INodeProperties[] = [
	{
		displayName: '部门ID',
		name: 'id',
		type: 'string',
		displayOptions: {
			show: showOnlyForGetSubDept,
		},
		default: '',
		placeholder: '1',
		description: '可选。部门ID。不填则获取全量组织架构',
	},
];

