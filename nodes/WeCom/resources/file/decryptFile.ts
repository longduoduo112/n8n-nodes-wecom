import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['file'],
	operation: ['decryptFile'],
};

export const decryptFileDescription: INodeProperties[] = [
	{
		displayName: '输入方式',
		name: 'inputType',
		type: 'options',
		displayOptions: {
			show: showOnly,
		},
		options: [
			{
				name: '从URL下载（推荐）',
				value: 'url',
				description: '输入文件URL，自动下载并解密，返回解密后的文件',
			},
			{
				name: '直接传入加密数据',
				value: 'binary',
				description: '传入已下载的加密文件二进制数据，自动解密后返回',
			},
		],
		default: 'url',
		description: '选择加密文件的输入方式。推荐使用URL方式，只需填写URL即可',
	},
	{
		displayName: '文件URL',
		name: 'url',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				inputType: ['url'],
			},
		},
		default: '',
		placeholder: 'https://ww-aibot-img-1258476243.cos.ap-guangzhou.myqcloud.com/...',
		description: '企业微信返回的文件下载URL（5分钟内有效）。节点会自动下载并解密该文件',
	},
	{
		displayName: '加密文件二进制属性',
		name: 'binaryProperty',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				...showOnly,
				inputType: ['binary'],
			},
		},
		default: 'data',
		description: '输入数据中包含加密文件数据的二进制属性名称。节点会自动解密该数据',
	},
	{
		displayName: '输出格式',
		name: 'outputFormat',
		type: 'options',
		displayOptions: {
			show: {
				...showOnly,
				inputType: ['binary'],
			},
		},
		options: [
			{
				name: '二进制文件',
				value: 'binary',
				description: '将解密后的文件作为二进制数据输出（推荐）',
			},
			{
				name: 'Base64字符串',
				value: 'base64',
				description: '将解密后的文件转换为Base64字符串输出',
			},
		],
		default: 'binary',
		description: '选择解密后文件的输出格式。默认返回二进制文件，可直接用于后续节点',
	},
];
