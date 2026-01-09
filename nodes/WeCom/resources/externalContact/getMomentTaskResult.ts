import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['externalContact'],
	operation: ['getMomentTaskResult'],
};

export const getMomentTaskResultDescription: INodeProperties[] = [
	{
		displayName: '异步任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: showOnly },
		description: '异步任务ID，最大长度为64字节，由创建发表内容到客户朋友圈任务接口获取，24小时有效',
		placeholder: 'xxxx',
	},
];
