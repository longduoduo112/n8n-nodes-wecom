import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 提交多企业新购订单
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98892
 *
 * 用途：
 * - 创建多企业新购任务之后，需要调用该接口，以提交多企业新购订单任务
 * - 提交之后，需要到服务商管理端发起支付，支付完成之后，订单才能生效
 *
 * 注意事项：
 * - jobid 必填
 * - buyer_userid 必须是服务商企业内具有"购买接口许可"权限的管理员
 *
 * @returns 操作结果
 */
export async function submitNewOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const jobid = this.getNodeParameter('jobid', index) as string;
	const buyerUserid = this.getNodeParameter('buyerUserid', index) as string;

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
			'多企业新购任务ID不能为空',
			{ itemIndex: index },
		);
	}

	if (!buyerUserid || buyerUserid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'下单人不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/submit_new_order_job',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			jobid,
			buyer_userid: buyerUserid,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`提交多企业新购订单失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`提交多企业新购订单失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
