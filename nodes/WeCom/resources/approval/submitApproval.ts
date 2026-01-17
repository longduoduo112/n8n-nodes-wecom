import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSubmitApproval = {
	resource: ['approval'],
	operation: ['submitApproval'],
};

export const submitApprovalDescription: INodeProperties[] = [
	{
		displayName: '审批申请数据',
		name: 'approvalData',
		type: 'json',
		required: true,
		displayOptions: {
			show: showOnlyForSubmitApproval,
		},
		default: '{\n  "creator_userid": "zhangsan",\n  "template_id": "3Tk5RSkUvVYQPcgXXXXXXXXXXX",\n  "apply_data": {\n    "contents": [\n      {\n        "control": "Text",\n        "id": "Text-1",\n        "value": {\n          "text": "请假原因"\n        }\n      }\n    ]\n  }\n}',
		description: '审批申请数据，JSON格式。必填字段：creator_userid（申请人UserID）、template_id（审批模板ID）、apply_data（审批申请数据）。<a href="https://developer.work.weixin.qq.com/document/path/91853" target="_blank">官方文档</a>',
	},
];

