import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取多企业新购订单提交结果
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98892
 *
 * 用途：
 * - 提交多企业新购订单之后，用于获取该订单的创建结果
 * - 该结果仅在提交多企业新购订单后7天内可获取
 *
 * 注意事项：
 * - jobid 必填
 * - status：1：创建完成，2：创建中，3：创建失败
 * - 仅在提交多企业新购订单后7天内可获取
 *
 * @returns 订单创建结果（包含订单号、状态、失败列表等）
 */
export async function newOrderJobResult(
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
			'多企业新购任务ID不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/new_order_job_result',
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
				`获取多企业新购订单提交结果失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取多企业新购订单提交结果失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
