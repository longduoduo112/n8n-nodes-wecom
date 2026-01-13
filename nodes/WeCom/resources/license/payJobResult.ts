import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取订单支付结果
 * 官方文档：https://developer.work.weixin.qq.com/document/path/99415
 *
 * 用途：
 * - 使用该接口获取余额订单支付任务的执行结果
 * - 仅在提交了"余额支付订单任务"后的7天内可获取
 *
 * 注意事项：
 * - status：1：支付成功，2：支付任务执行中，3：支付失败
 * - 支付失败时会返回 pay_job_result，包含失败原因和失败企业列表
 * - 仅在提交了"余额支付订单任务"后的7天内可获取
 *
 * @returns 订单支付结果（包含支付状态、支付结果信息等）
 */
export async function payJobResult(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const jobid = this.getNodeParameter('jobid', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!jobid || jobid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'支付任务ID不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/pay_job_result`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			jobid,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取订单支付结果失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取订单支付结果失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}