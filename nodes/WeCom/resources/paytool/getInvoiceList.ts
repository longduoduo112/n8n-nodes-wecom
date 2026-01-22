import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取发票列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/99436
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
	// 辅助函数：将dateTime转换为Unix时间戳（秒级）
	function dateTimeToUnixTimestamp(dateTime: string | number | undefined): number | undefined {
		if (!dateTime || dateTime === '') {
			return undefined;
		}
		if (typeof dateTime === 'number') {
			return dateTime > 0 ? dateTime : undefined;
		}
		return Math.floor(new Date(dateTime).getTime() / 1000);
	}

	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const startTime = dateTimeToUnixTimestamp(this.getNodeParameter('startTime', index) as string | number | undefined);
	const endTime = dateTimeToUnixTimestamp(this.getNodeParameter('endTime', index) as string | number | undefined);
	const cursor = this.getNodeParameter('cursor', index) as string | undefined;
	const limit = this.getNodeParameter('limit', index) as number | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (startTime !== undefined && endTime === undefined) {
		throw new NodeOperationError(
			this.getNode(),
			'start_time和end_time必须同时指定，不能单独指定start_time',
			{ itemIndex: index },
		);
	}

	if (endTime !== undefined && startTime === undefined) {
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

	if (startTime !== undefined) {
		body.start_time = startTime;
	}

	if (endTime !== undefined) {
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
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/paytool/get_invoice_list`,
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