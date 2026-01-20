import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createDecipheriv } from 'crypto';

/**
 * 解密文件
 * 
 * 从URL下载加密文件并使用AES-256-CBC解密
 * 加密方式：AES-256-CBC，数据采用PKCS#7填充至32字节的倍数
 * IV初始向量大小为16字节，取AESKey前16字节
 */
export async function executeFile(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			if (operation === 'decryptFile') {
				const inputType = this.getNodeParameter('inputType', i, 'url') as string;
				const outputFormat = this.getNodeParameter('outputFormat', i, 'binary') as string;
				const binaryPropertyName = 'data';

				// 从凭证中获取 EncodingAESKey
				let encodingAESKey: string;
				try {
					const credentials = await this.getCredentials('weComReceiveApi');
					encodingAESKey = (credentials as { encodingAESKey: string }).encodingAESKey;
					if (!encodingAESKey) {
						throw new NodeOperationError(
							this.getNode(),
							'凭证中未找到 EncodingAESKey，请检查"企业微信消息接收 API"凭证配置',
							{ itemIndex: i },
						);
					}
				} catch (error) {
					if (error instanceof NodeOperationError) {
						throw error;
					}
					throw new NodeOperationError(
						this.getNode(),
						`获取凭证失败: ${(error as Error).message}。请确保已配置"企业微信消息接收 API"凭证`,
						{ itemIndex: i },
					);
				}

				// 解析AESKey
				// EncodingAESKey 是 Base64 编码的 43 位字符串，需要加上 '=' 补齐到 44 位
				const aesKey = encodingAESKey + '=';
				let key: Buffer;
				try {
					key = Buffer.from(aesKey, 'base64');
				} catch (error) {
					throw new NodeOperationError(
						this.getNode(),
						`EncodingAESKey格式错误: ${(error as Error).message}`,
						{ itemIndex: i },
					);
				}

				// 验证密钥长度
				if (key.length !== 32) {
					throw new NodeOperationError(
						this.getNode(),
						`EncodingAESKey解码后必须是32字节，实际为${key.length}字节`,
						{ itemIndex: i },
					);
				}

				// 获取加密文件数据
				let encryptedData: Buffer;
				if (inputType === 'url') {
					// 从URL下载
					const url = this.getNodeParameter('url', i) as string;
					if (!url) {
						throw new NodeOperationError(this.getNode(), '文件URL不能为空', { itemIndex: i });
					}

					try {
						const downloadOptions = {
							method: 'GET' as const,
							url,
							encoding: 'arraybuffer' as const,
							returnFullResponse: false,
						};

						const response = await this.helpers.httpRequest(downloadOptions);
						
						if (Buffer.isBuffer(response)) {
							encryptedData = response;
						} else if (typeof response === 'string') {
							encryptedData = Buffer.from(response, 'utf8');
						} else if (response instanceof ArrayBuffer) {
							encryptedData = Buffer.from(response);
						} else {
							throw new NodeOperationError(
								this.getNode(),
								'无法解析下载的文件数据',
								{ itemIndex: i },
							);
						}
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`下载文件失败: ${(error as Error).message}`,
							{ itemIndex: i },
						);
					}
				} else {
					// 从二进制数据获取
					const binaryProperty = this.getNodeParameter('binaryProperty', i, 'data') as string;
					try {
						this.helpers.assertBinaryData(i, binaryProperty);
						encryptedData = await this.helpers.getBinaryDataBuffer(i, binaryProperty);
					} catch (error) {
						throw new NodeOperationError(
							this.getNode(),
							`获取二进制数据失败: ${(error as Error).message}。请确保输入数据中包含名为"${binaryProperty}"的二进制属性`,
							{ itemIndex: i },
						);
					}
				}

				// 解密文件
				let decryptedData: Buffer;
				try {
					// IV 为 AESKey 的前 16 字节
					const iv = key.slice(0, 16);
					const decipher = createDecipheriv('aes-256-cbc', key, iv);
					decipher.setAutoPadding(false); // 手动处理 PKCS7 填充

					const decrypted = Buffer.concat([decipher.update(encryptedData), decipher.final()]);

					// 去除 PKCS7 填充
					// PKCS7：填充字节的值等于填充字节的个数
					const pad = decrypted[decrypted.length - 1];
					if (pad < 1 || pad > 32) {
						throw new NodeOperationError(
							this.getNode(),
							`无效的填充值: ${pad}`,
							{ itemIndex: i },
						);
					}

					// 验证所有填充字节的值是否一致
					for (let j = 0; j < pad; j++) {
						if (decrypted[decrypted.length - 1 - j] !== pad) {
							throw new NodeOperationError(
								this.getNode(),
								'填充字节不一致',
								{ itemIndex: i },
							);
						}
					}

					decryptedData = decrypted.slice(0, decrypted.length - pad);
				} catch (error) {
					if (error instanceof NodeOperationError) {
						throw error;
					}
					throw new NodeOperationError(
						this.getNode(),
						`文件解密失败: ${(error as Error).message}`,
						{ itemIndex: i },
					);
				}

				// 根据输出格式返回数据
				const result: INodeExecutionData = {
					json: {} as IDataObject,
					pairedItem: { item: i },
				};

				if (outputFormat === 'base64') {
					// 输出为Base64字符串
					result.json = {
						data: decryptedData.toString('base64'),
						size: decryptedData.length,
					};
				} else {
					// 输出为二进制数据
					result.json = {
						size: decryptedData.length,
					};
					result.binary = {
						[binaryPropertyName]: {
							data: decryptedData.toString('base64'),
							mimeType: 'application/octet-stream',
						},
					};
				}

				returnData.push(result);
			} else {
				throw new NodeOperationError(
					this.getNode(),
					`未知的操作: ${operation}`,
					{ itemIndex: i },
				);
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
