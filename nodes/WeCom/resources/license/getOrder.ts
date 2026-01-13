import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取订单详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95648
 *
 * 用途：
 * - 查询某个订单的详情，包括订单的状态、基础账号个数、互通账号个数、账号购买时长等
 * - 注意：该接口不返回订单中的账号激活码列表或者续期的账号成员列表
 * - 请调用获取订单中的账号列表接口以获取账号列表
 *
 * 注意事项：
 * - 此接口不支持获取多企业订单详情，多企业订单请调用获取多企业订单详情
 * - 订单类型：1：购买账号，2：续期账号，5：应用版本付费迁移订单，6：历史合同迁移订单
 * - 订单状态：0：待支付，1：已支付，2：已取消，3：未支付订单已过期，4：申请退款中，5：退款成功，6：退款被拒绝，7：订单已失效
 *
 * @returns 订单详情信息
 */
export async function getOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const orderId = this.getNodeParameter('orderId', index) as string;

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

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/get_order`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			order_id: orderId,
		},
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