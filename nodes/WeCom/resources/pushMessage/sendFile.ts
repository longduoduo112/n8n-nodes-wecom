import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSendFile = {
	resource: ['pushMessage'],
	operation: ['sendFile'],
};

export const sendFileDescription: INodeProperties[] = [
	{
		displayName: 'Media ID',
		name: 'mediaId',
		type: 'string',
		displayOptions: {
			show: showOnlyForSendFile,
		},
		default: '',
		required: true,
		placeholder: '请输入文件的 media_id...',
		description: '文件的 media_id，通过素材管理接口上传文件获得。需先通过上传临时素材接口获取 media_id。<a href="https://developer.work.weixin.qq.com/document/path/99110#%E6%96%87%E4%BB%B6%E7%B1%BB%E5%9E%8B" target="_blank">官方文档</a>',
	},
];

