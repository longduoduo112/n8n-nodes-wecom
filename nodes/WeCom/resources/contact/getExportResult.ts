import type { INodeProperties } from 'n8n-workflow';

const showOnlyForGetExportResult = {
	resource: ['contact'],
	operation: ['getExportResult'],
};

export const getExportResultDescription: INodeProperties[] = [
	{
		displayName: '任务ID',
		name: 'jobid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForGetExportResult,
		},
		default: '',
		placeholder: 'jobid_xxxxxxxxxxxxxxx',
		description: '导出任务接口成功后返回的任务ID。获取任务结果的调用身份需要与提交任务的一致。返回结果包含任务状态（0-未处理，1-处理中，2-完成，3-异常失败）和数据文件列表。数据下载链接有效期2个小时，支持指定Range头部分段下载。<a href="https://developer.work.weixin.qq.com/document/path/94854" target="_blank">官方文档</a>',
		hint: '导出任务接口返回的jobid，调用身份需与提交任务一致',
	},
];

