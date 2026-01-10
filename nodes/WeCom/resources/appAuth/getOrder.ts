import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取订单详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90600
 *
 * 用途：
 * - 服务商可以使用该接口查询指定订单的详情
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - suite_access_token有效期为2小时
 * - orderid为必填参数
 *
 * @returns 订单详情信息
 */
export async function getOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = this.getNodeParameter('suiteAccessToken', index) as string;
	const orderid = this.getNodeParameter('orderid', index) as string;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!orderid) {
		throw new NodeOperationError(
			this.getNode(),
			'订单号不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		orderid,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/service/get_order',
		qs: {
			suite_access_token: suiteAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取订单详情失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取订单详情失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
