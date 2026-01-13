import type {
	IExecuteFunctions,
	IDataObject,
	IHttpRequestOptions,
	INodeExecutionData,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取应用二维码
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95430
 *
 * 用途：
 * - 用于获取第三方应用二维码
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - 要求第三方应用是已上线的第三方通用应用
 * - result_type为1时返回二维码图片buffer（二进制数据）
 * - result_type为2时返回JSON格式的二维码URL
 *
 * @returns 二维码图片buffer或URL
 */
export async function getAppQrcode(
	this: IExecuteFunctions,
	index: number,
): Promise<INodeExecutionData> {
	const suiteAccessToken = this.getNodeParameter('suiteAccessToken', index) as string;
	const suiteId = this.getNodeParameter('suiteId', index) as string;
	const appid = this.getNodeParameter('appid', index, 1) as number;
	const state = this.getNodeParameter('state', index, '') as string;
	const style = this.getNodeParameter('style', index, 2) as number;
	const resultType = this.getNodeParameter('resultType', index, 1) as number;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!suiteId) {
		throw new NodeOperationError(
			this.getNode(),
			'第三方应用ID不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		suite_id: suiteId,
		style,
		result_type: resultType,
	};

	if (appid !== 1) {
		body.appid = appid;
	}

	if (state && state.trim()) {
		body.state = state.trim();
	}

	let options: IHttpRequestOptions;

	if (resultType === 1) {
		options = {
			method: 'POST',
			url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_app_qrcode`,
			qs: {
				suite_access_token: suiteAccessToken,
			},
			body,
			encoding: 'arraybuffer',
			returnFullResponse: true,
		};
	} else {
		options = {
			method: 'POST',
			url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_app_qrcode`,
			qs: {
				suite_access_token: suiteAccessToken,
			},
			body,
			json: true,
		};
	}

	try {
		if (resultType === 1) {
			const downloadResponse = (await this.helpers.httpRequest(options)) as {
				body: Buffer | ArrayBuffer | string | ArrayBufferView;
				headers: IDataObject;
			};

			let buffer: Buffer;

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
				throw new NodeOperationError(
					this.getNode(),
					'无法获取二维码内容：响应中没有数据',
					{ itemIndex: index },
				);
			}

			let filename = 'qrcode.png';
			if (downloadResponse.headers) {
				const contentDisposition =
					(downloadResponse.headers['content-disposition'] ||
						downloadResponse.headers['Content-Disposition']) as string | undefined;
				if (typeof contentDisposition === 'string') {
					const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
					if (match && match[1]) {
						filename = match[1].replace(/['"]/g, '');
						try {
							filename = decodeURIComponent(filename);
						} catch {
							// Keep original filename if decode fails
						}
					}
				}
			}

			const binaryData = await this.helpers.prepareBinaryData(buffer, filename);

			return {
				json: { success: true },
				binary: {
					data: binaryData,
				},
				} as INodeExecutionData;
		} else {
			const response = (await this.helpers.httpRequest(options)) as IDataObject;

			if (response.errcode !== undefined && response.errcode !== 0) {
				throw new NodeOperationError(
					this.getNode(),
					`获取应用二维码失败: ${response.errmsg} (错误码: ${response.errcode})`,
					{ itemIndex: index },
				);
			}

			return {
				json: response,
			} as INodeExecutionData;
		}
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取应用二维码失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}