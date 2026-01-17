import type { INodeProperties } from 'n8n-workflow';

const showOnlyForCreateApprovalTemplate = {
	resource: ['approval'],
	operation: ['createApprovalTemplate'],
};

export const createApprovalTemplateDescription: INodeProperties[] = [
	{
		displayName: '模板数据',
		name: 'templateData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForCreateApprovalTemplate,
		},
		default: '{}',
		description: '审批模板数据，JSON格式。包含template_id（模板ID）、template_name（模板名称）等字段',
	},
];

