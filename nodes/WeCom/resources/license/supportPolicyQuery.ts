import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 民生优惠条件查询
 * 官方文档：https://developer.work.weixin.qq.com/document/path/96515
 *
 * 用途：
 * - 查询企业是否满足民生行业政策的优惠条件
 *
 * 注意事项：
 * - 民生行业接口许可优惠政策于2023年3月31日到期，到期后不再支持查询
 * - 查询的企业必须安装了服务商的第三方应用或者代开发应用
 * - 一个企业在30天内最多只能查询一次
 * - corpid：企业id，支持加密和非加密的corpid
 * - query_result：查询结果。0表示不符合减免条件；1表示符合减免条件
 * - unsatisfied_reason：被查询企业不符合减免条件的原因对应的错误码列表
 *
 * @returns 民生优惠条件查询结果
 */
export async function supportPolicyQuery(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!corpid || corpid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'企业ID不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		corpid,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/support_policy_query',
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
				`民生优惠条件查询失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`民生优惠条件查询失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
