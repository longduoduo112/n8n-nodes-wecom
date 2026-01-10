import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 充值账户余额查询
 * 官方文档：https://developer.work.weixin.qq.com/document/path/100137
 *
 * 用途：
 * - 可以通过该接口查询服务商充值账户余额
 *
 * 注意事项：
 * - balance：充值账户余额，单位为分
 *
 * @returns 充值账户余额信息
 */
export async function getAccountBalance(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'GET',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/service/get_account_balance',
		qs: {
			provider_access_token: providerAccessToken,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`充值账户余额查询失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`充值账户余额查询失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
