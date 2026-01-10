import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 取消订单
 * 官方文档：https://developer.work.weixin.qq.com/document/path/96106
 *
 * 用途：
 * - 取消接口许可购买和续费订单
 * - 只可取消未支付且未失效的订单
 *
 * 注意事项：
 * - 订单ID必填
 * - 企业ID：如果是多企业新购订单时不填，否则必填
 * - 只能取消未支付且未失效的订单
 *
 * @returns 操作结果
 */
export async function cancelOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const orderId = this.getNodeParameter('orderId', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string | undefined;
	const isMultiCorpOrder = this.getNodeParameter('isMultiCorpOrder', index, false) as boolean;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!orderId || orderId.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'订单ID不能为空',
			{ itemIndex: index },
		);
	}

	if (!isMultiCorpOrder && (!corpid || corpid.trim() === '')) {
		throw new NodeOperationError(
			this.getNode(),
			'企业ID不能为空（多企业新购订单除外）',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		order_id: orderId,
	};

	if (!isMultiCorpOrder && corpid && corpid.trim() !== '') {
		body.corpid = corpid;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/cancel_order',
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
				`取消订单失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`取消订单失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
