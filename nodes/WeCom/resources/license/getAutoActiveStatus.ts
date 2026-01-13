import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 查询企业的许可自动激活状态
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95874
 *
 * 用途：
 * - 服务商可以调用该接口查询授权企业的许可自动激活状态
 *
 * 注意事项：
 * - 查询的企业corpid，要求服务商为企业购买过接口许可才有查询结果
 * - auto_active_status：0：关闭，1：打开
 *
 * @returns 企业的许可自动激活状态信息
 */
export async function getAutoActiveStatus(
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
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/get_auto_active_status`,
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
				`查询企业的许可自动激活状态失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`查询企业的许可自动激活状态失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}