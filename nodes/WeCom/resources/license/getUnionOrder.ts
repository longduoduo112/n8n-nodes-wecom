import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取多企业订单详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98893
 *
 * 用途：
 * - 查询某个多企业订单的详情，包括订单的状态、购买的企业、基础账号个数、互通账号个数、账号购买时长等
 * - 如需每个企业的账号列表，请使用该接口返回的 sub_order_id 调用获取订单中的账号列表接口以获取账号列表
 *
 * 注意事项：
 * - 订单类型：8：多企业新购订单
 * - 订单状态：0：待支付，1：已支付，2：已取消，3：未支付订单已过期
 * - limit 最大值1000，默认值500
 * - 支持分页查询（通过 cursor 游标）
 *
 * @returns 多企业订单详情信息（包含订单详情和多企业购买信息列表）
 */
export async function getUnionOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const orderId = this.getNodeParameter('orderId', index) as string;
	const cursor = this.getNodeParameter('cursor', index) as string | undefined;
	const limit = this.getNodeParameter('limit', index, 500) as number;

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

	// 验证 limit 范围
	if (limit < 1 || limit > 1000) {
		throw new NodeOperationError(
			this.getNode(),
			'返回的最大记录数必须在1-1000之间',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		order_id: orderId,
		limit,
	};

	if (cursor && cursor.trim() !== '') {
		body.cursor = cursor;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/get_union_order',
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
				`获取多企业订单详情失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取多企业订单详情失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
