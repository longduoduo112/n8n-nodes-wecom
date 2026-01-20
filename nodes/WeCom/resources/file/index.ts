import type { INodeProperties } from 'n8n-workflow';
import { decryptFileDescription } from './decryptFile';

const showOnlyForFile = {
	resource: ['file'],
};

export const fileDescription: INodeProperties[] = [
	{
		displayName: '操作',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForFile,
		},
		options: [
			{
				name: '解密文件',
				value: 'decryptFile',
				action: '解密文件',
				description: '下载并解密接收到的加密文件',
			},
		],
		default: 'decryptFile',
	},
	...decryptFileDescription,
];
