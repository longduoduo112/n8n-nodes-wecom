import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExportTag = {
	resource: ['contact'],
	operation: ['exportTagUser'],
};

export const exportTagUserDescription: INodeProperties[] = [
	{
		displayName: '标签ID',
		name: 'tagid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForExportTag,
		},
		default: '',
		placeholder: '1',
		description: '需要导出的标签ID。要求对标签有读取权限。<a href="https://developer.work.weixin.qq.com/document/path/94853" target="_blank">官方文档</a>',
		hint: '需要导出的标签ID',
	},
	{
		displayName: '加密密钥',
		name: 'encoding_aeskey',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnlyForExportTag,
		},
		default: '',
		placeholder: 'IJUiXNpvGbODwKEBSEsAeOAPAhkqHqNCF6g19t9wfg2',
		description: 'Base64编码后的加密密钥。长度固定为43，从a-z, A-Z, 0-9共62个字符中选取，是AESKey的Base64编码。解码后即为32字节长的AESKey。加密方式采用AES-256-CBC方式，数据采用PKCS#7填充至32字节的倍数；IV初始向量大小为16字节，取AESKey前16字节。<a href="https://developer.work.weixin.qq.com/document/path/94853" target="_blank">官方文档</a>',
		hint: 'Base64编码的AES密钥，长度固定为43',
	},
	{
		displayName: '每块数据的人员数和部门数之和',
		name: 'block_size',
		type: 'number',
		displayOptions: {
			show: showOnlyForExportTag,
		},
		default: 106,
		typeOptions: {
			minValue: 104,
			maxValue: 106,
		},
		description: '可选。每块数据的人员数和部门数之和，支持范围[104,106]，默认值为106。<a href="https://developer.work.weixin.qq.com/document/path/94853" target="_blank">官方文档</a>',
		hint: '每块数据的人员数和部门数之和，范围104-106，默认106',
	},
];

