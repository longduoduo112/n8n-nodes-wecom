import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 提交余额支付订单任务
 * 官方文档：https://developer.work.weixin.qq.com/document/path/99415
 *
 * 用途：
 * - 使用该接口创建支付任务，该接口默认使用充值账户余额进行支付
 * - 提交成功后，该订单无法再变更支付方式
 * - 提交支付任务成功后，支付任务异步进行，服务商还需要调用"获取订单支付结果"以获取支付的最终结果
 *
 * 注意事项：
 * - 可以支付的订单包括单企业购买、单企业续期、多企业购买创建的订单
 * - payer_userid 必须是服务商企业内具有"购买接口许可"权限的管理员
 * - 支付成功后自动扣款，且服务商可接收到支付成功的回调
 *
 * @returns 支付任务信息（包含jobid）
 */
export async function submitPayJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const payerUserid = this.getNodeParameter('payerUserid', index) as string;
	const orderId = this.getNodeParameter('orderId', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!payerUserid || payerUserid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'支付人不能为空',
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
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/submit_pay_job`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			payer_userid: payerUserid,
			order_id: orderId,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`提交余额支付订单任务失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`提交余额支付订单任务失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}