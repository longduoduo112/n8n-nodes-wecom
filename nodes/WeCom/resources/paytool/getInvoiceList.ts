import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取发票列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95430
 *
 * 用途：
 * - 服务商可以使用该接口查询某个客户或某段时间内申请的应用订单发票列表
 *
 * 注意事项：
 * - 服务商需有在收银台完成商户号注册
 * - 此接口不需要签名，只需要provider_access_token
 * - start_time和end_time必须同时指定，不能单独指定
 *
 * @returns 发票列表信息
 */
export async function getInvoiceList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const startTime = this.getNodeParameter('startTime', index) as number | undefined;
	const endTime = this.getNodeParameter('endTime', index) as number | undefined;
	const cursor = this.getNodeParameter('cursor', index) as string | undefined;
	const limit = this.getNodeParameter('limit', index) as number | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if ((startTime !== undefined && startTime !== 0) && (endTime === undefined || endTime === 0)) {
		throw new NodeOperationError(
			this.getNode(),
			'start_time和end_time必须同时指定，不能单独指定start_time',
			{ itemIndex: index },
		);
	}

	if ((endTime !== undefined && endTime !== 0) && (startTime === undefined || startTime === 0)) {
		throw new NodeOperationError(
			this.getNode(),
			'start_time和end_time必须同时指定，不能单独指定end_time',
			{ itemIndex: index },
		);
	}

	if (limit !== undefined && limit > 100) {
		throw new NodeOperationError(
			this.getNode(),
			'返回的最大记录数不能超过100',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {};

	if (startTime !== undefined && startTime !== 0) {
		body.start_time = startTime;
	}

	if (endTime !== undefined && endTime !== 0) {
		body.end_time = endTime;
	}

	if (cursor) {
		body.cursor = cursor;
	}

	if (limit !== undefined) {
		body.limit = limit;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/paytool/get_invoice_list',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取发票列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取发票列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
