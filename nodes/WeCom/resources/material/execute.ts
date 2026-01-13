import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getAccessToken, getWeComBaseUrl } from '../../shared/transport';

export async function executeMaterial(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			// 上传临时素材
			if (operation === 'uploadTemp') {
				const type = this.getNodeParameter('type', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const fileName = (binaryData.fileName || 'file');
				const contentType = binaryData.mimeType || 'application/octet-stream';
				const fileLength = dataBuffer.length;

				// 文件大小校验（所有文件size必须大于5个字节）
				if (fileLength <= 5) {
					throw new NodeOperationError(
						this.getNode(),
						'文件大小必须大于5个字节',
					);
				}

				const accessToken = await getAccessToken.call(this);

				// 手动构建 multipart/form-data 请求体
				const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
				const CRLF = '\r\n';

				const header = `--${boundary}${CRLF}Content-Disposition: form-data; name="media";filename="${fileName}"; filelength=${fileLength}${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`;
				const footer = `${CRLF}--${boundary}--${CRLF}`;

				const headerBuffer = Buffer.from(header, 'utf-8');
				const footerBuffer = Buffer.from(footer, 'utf-8');
				const bodyBuffer = Buffer.concat([headerBuffer, dataBuffer, footerBuffer]);

				const uploadUrl = `${await getWeComBaseUrl.call(this)}/cgi-bin/media/upload?access_token=${accessToken}&type=${type}`;

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: uploadUrl,
					body: bodyBuffer,
					headers: {
						'Content-Type': `multipart/form-data; boundary=${boundary}`,
						'Content-Length': bodyBuffer.length.toString(),
					},
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`上传临时素材失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			}
			// 上传图片获取URL
			else if (operation === 'uploadImage') {
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const filename = this.getNodeParameter('filename', i, '') as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const finalFilename = (filename || binaryData.fileName || 'image.png');
				const contentType = binaryData.mimeType || 'image/png';
				const fileLength = dataBuffer.length;

				// 图片文件大小限制：5B ~ 2MB
				if (fileLength <= 5) {
					throw new NodeOperationError(
						this.getNode(),
						'图片文件大小必须大于5个字节',
					);
				}
				const maxSize = 2 * 1024 * 1024; // 2MB
				if (fileLength > maxSize) {
					throw new NodeOperationError(
						this.getNode(),
						`图片文件大小不能超过2MB，当前文件大小: ${(fileLength / 1024 / 1024).toFixed(2)}MB`,
					);
				}

				const accessToken = await getAccessToken.call(this);

				// 手动构建 multipart/form-data 请求体
				const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
				const CRLF = '\r\n';

				const header = `--${boundary}${CRLF}Content-Disposition: form-data; name="media";filename="${finalFilename}"${CRLF}Content-Type: ${contentType}${CRLF}${CRLF}`;
				const footer = `${CRLF}--${boundary}--${CRLF}`;

				const headerBuffer = Buffer.from(header, 'utf-8');
				const footerBuffer = Buffer.from(footer, 'utf-8');
				const bodyBuffer = Buffer.concat([headerBuffer, dataBuffer, footerBuffer]);

				const uploadUrl = `${await getWeComBaseUrl.call(this)}/cgi-bin/media/uploadimg?access_token=${accessToken}`;

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: uploadUrl,
					body: bodyBuffer,
					headers: {
						'Content-Type': `multipart/form-data; boundary=${boundary}`,
						'Content-Length': bodyBuffer.length.toString(),
					},
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`上传图片失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			}
			// 获取临时素材
			else if (operation === 'getTemp') {
				const media_id = this.getNodeParameter('media_ID', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i) as string;

				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/media/get`,
					qs: {
						access_token: accessToken,
						media_id,
					},
					encoding: 'arraybuffer' as const,
					returnFullResponse: true,
				};

				const downloadResponse = await this.helpers.httpRequest(downloadOptions);

				const contentType =
					(downloadResponse.headers?.['content-type'] ||
						downloadResponse.headers?.['Content-Type'] ||
						'') as string;

				if (contentType.includes('application/json') || contentType.includes('text/plain')) {
					let errorBody = downloadResponse.body;
					if (Buffer.isBuffer(errorBody)) {
						errorBody = errorBody.toString('utf-8');
					}

					try {
						const errorData =
							typeof errorBody === 'string' ? JSON.parse(errorBody) : errorBody;
						if (errorData.errcode && errorData.errcode !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`获取临时素材失败: ${errorData.errmsg} (错误码: ${errorData.errcode})`,
							);
						}
					} catch (error) {
						if (error instanceof NodeOperationError) {
							throw error;
						}
						throw new NodeOperationError(
							this.getNode(),
							`获取临时素材失败: ${String(errorBody)}`,
						);
					}
				}

				// 处理二进制响应
				let buffer: Buffer;
				let filename = 'file';

				if (downloadResponse.body) {
					if (Buffer.isBuffer(downloadResponse.body)) {
						buffer = downloadResponse.body;
					} else if (downloadResponse.body instanceof ArrayBuffer) {
						buffer = Buffer.from(downloadResponse.body);
					} else if (typeof downloadResponse.body === 'string') {
						buffer = Buffer.from(downloadResponse.body, 'binary');
					} else if (ArrayBuffer.isView(downloadResponse.body)) {
						buffer = Buffer.from(downloadResponse.body.buffer);
					} else {
						buffer = Buffer.from(String(downloadResponse.body));
					}
				} else {
					throw new NodeOperationError(this.getNode(), '无法获取素材内容：响应中没有数据');
				}

				// 尝试从响应头获取文件名
				// 响应头示例：Content-disposition: attachment; filename="MEDIA_ID.jpg"
				if (downloadResponse.headers) {
					const contentDisposition =
						downloadResponse.headers['content-disposition'] ||
						downloadResponse.headers['Content-Disposition'];
					if (typeof contentDisposition === 'string') {
						const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (match && match[1]) {
							filename = match[1].replace(/['"]/g, '');
							try {
								filename = decodeURIComponent(filename);
							} catch {
								// 解码失败使用原始文件名
							}
						}
					}
				}

				const binaryData = await this.helpers.prepareBinaryData(buffer, filename);

				returnData.push({
					json: { media_id },
					binary: {
						[binaryPropertyName]: binaryData,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			// 获取高清语音素材
			else if (operation === 'getHighQualityVoice') {
				const media_id = this.getNodeParameter('media_ID', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryProperty', i, 'data') as string;

				const accessToken = await getAccessToken.call(this);

				const downloadOptions = {
					method: 'GET' as const,
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/media/get/jssdk`,
					qs: {
						access_token: accessToken,
						media_id,
					},
					encoding: 'arraybuffer' as const,
					returnFullResponse: true,
				};

				const voiceResponse = await this.helpers.httpRequest(downloadOptions);

				// 检查是否返回了错误（JSON格式）
				const contentType =
					(voiceResponse.headers?.['content-type'] ||
						voiceResponse.headers?.['Content-Type'] ||
						'') as string;

				if (contentType.includes('application/json') || contentType.includes('text/plain')) {
					let errorBody = voiceResponse.body;
					if (Buffer.isBuffer(errorBody)) {
						errorBody = errorBody.toString('utf-8');
					}

					try {
						const errorData =
							typeof errorBody === 'string' ? JSON.parse(errorBody) : errorBody;
						if (errorData.errcode && errorData.errcode !== 0) {
							throw new NodeOperationError(
								this.getNode(),
								`获取高清语音失败: ${errorData.errmsg} (错误码: ${errorData.errcode})`,
							);
						}
					} catch (error) {
						if (error instanceof NodeOperationError) {
							throw error;
						}
						throw new NodeOperationError(
							this.getNode(),
							`获取高清语音失败: ${String(errorBody)}`,
						);
					}
				}

				// 处理二进制响应
				let buffer: Buffer;
				// 默认文件名使用 .speex 扩展名（格式为speex，16K采样率）
				let filename = 'voice.speex';

				if (voiceResponse.body) {
					if (Buffer.isBuffer(voiceResponse.body)) {
						buffer = voiceResponse.body;
					} else if (voiceResponse.body instanceof ArrayBuffer) {
						buffer = Buffer.from(voiceResponse.body);
					} else if (typeof voiceResponse.body === 'string') {
						buffer = Buffer.from(voiceResponse.body, 'binary');
					} else if (ArrayBuffer.isView(voiceResponse.body)) {
						buffer = Buffer.from(voiceResponse.body.buffer);
					} else {
						buffer = Buffer.from(String(voiceResponse.body));
					}
				} else {
					throw new NodeOperationError(this.getNode(), '无法获取高清语音内容：响应中没有数据');
				}

				// 尝试从响应头获取文件名
				// 响应头示例：Content-disposition: attachment; filename="XXX"
				if (voiceResponse.headers) {
					const contentDisposition =
						voiceResponse.headers['content-disposition'] ||
						voiceResponse.headers['Content-Disposition'];
					if (typeof contentDisposition === 'string') {
						const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
						if (match && match[1]) {
							filename = match[1].replace(/['"]/g, '');
							try {
								filename = decodeURIComponent(filename);
							} catch {
								// 解码失败使用原始文件名
							}
						}
					}
				}

				const binaryData = await this.helpers.prepareBinaryData(buffer, filename);

				returnData.push({
					json: { media_id },
					binary: {
						[binaryPropertyName]: binaryData,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			// 异步上传临时素材（生成异步上传任务）
			else if (operation === 'uploadTempAsync') {
				const scene = this.getNodeParameter('scene', i) as number;
				const type = this.getNodeParameter('type', i) as string;
				const filename = this.getNodeParameter('filename', i) as string;
				const url = this.getNodeParameter('url', i) as string;
				const md5 = this.getNodeParameter('md5', i) as string;

				const accessToken = await getAccessToken.call(this);

				// 请求体为 JSON 格式
				const requestBody = {
					scene,
					type,
					filename,
					url,
					md5,
				};

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/media/upload_by_url?access_token=${accessToken}`,
					body: requestBody,
					json: true,
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`生成异步上传任务失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			}
			// 查询异步任务结果
			else if (operation === 'getUploadByUrlResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;

				const accessToken = await getAccessToken.call(this);

				response = (await this.helpers.httpRequest({
					method: 'POST',
					url: `${await getWeComBaseUrl.call(this)}/cgi-bin/media/get_upload_by_url_result?access_token=${accessToken}`,
					body: { jobid },
					json: true,
				})) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new NodeOperationError(
						this.getNode(),
						`查询异步任务结果失败: ${response.errmsg} (错误码: ${response.errcode})`,
					);
				}
			} else {
				throw new NodeOperationError(this.getNode(), `不支持的操作: ${operation}`);
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
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
