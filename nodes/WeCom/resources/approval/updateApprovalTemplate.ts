import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUpdateApprovalTemplate = {
	resource: ['approval'],
	operation: ['updateApprovalTemplate'],
};

export const updateApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板ID',
		name: 'template_id',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateApprovalTemplate,
		},
		default: '',
		description: '要更新的审批模板唯一标识ID',
	},
	{
		displayName: '模板数据',
		name: 'templateData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForUpdateApprovalTemplate,
		},
		default: '{}',
		description: '更新的审批模板数据，JSON格式。包含template_name（模板名称）等字段',
	},
];

