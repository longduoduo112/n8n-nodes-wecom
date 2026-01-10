import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取订单中的账号列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95649
 *
 * 用途：
 * - 查询指定订单下的平台能力服务账号列表
 * - 若为购买账号的订单或者存量企业的版本付费迁移订单，则返回账号激活码列表
 * - 若为续期账号的订单，则返回续期账号的成员列表
 *
 * 注意事项：
 * - 若是购买账号的订单，则仅订单支付完成时，系统才会生成账号，故支付完成之前，该接口不会返回账号激活码
 * - 如果是多企业订单，请先调用获取多企业订单详情获取到每个企业的子订单id (sub_order_id)，然后使用 sub_order_id 来调用此接口
 * - limit 最大值1000，默认值500
 * - 账号类型：1:基础账号，2:互通账号
 *
 * @returns 账号列表信息（包含账号列表、分页游标等）
 */
export async function listOrderAccount(
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
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/list_order_account',
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
				`获取订单中的账号列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取订单中的账号列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
