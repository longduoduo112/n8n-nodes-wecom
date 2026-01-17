import type { INodeProperties } from 'n8n-workflow';
const showOnly = { resource: ['wedoc'], operation: ['getFormAnswer'] };
export const getFormAnswerDescription: INodeProperties[] = [
	{ displayName: '收集表周期ID', name: 'repeated_id', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '操作的收集表周期repeated_id。收集表周期ID', placeholder: '收集表周期ID' },
	{ displayName: '答案ID列表', name: 'answer_ids', type: 'string', required: true, displayOptions: { show: showOnly }, default: '', description: '需要拉取的答案列表，多个ID用英文逗号分隔，批次大小最大100。例如：1,2,3 或单个ID：1', placeholder: '1,2,3' },
];
