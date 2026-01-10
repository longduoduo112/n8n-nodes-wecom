import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 设置企业的许可自动激活状态
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95873
 *
 * 用途：
 * - 服务商可以调用该接口设置授权企业的许可自动激活状态
 * - 设置为自动激活后，对应授权企业的员工使用服务商应用时，接口许可表现为自动激活
 *
 * 注意事项：
 * - 企业corpid，要求服务商为企业购买过接口许可，购买指支付完成，购买并退款成功包括在内
 * - auto_active_status：0：关闭，1：打开
 *
 * @returns 设置结果
 */
export async function setAutoActiveStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const autoActiveStatus = this.getNodeParameter('autoActiveStatus', index) as number;

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

	if (autoActiveStatus === undefined || (autoActiveStatus !== 0 && autoActiveStatus !== 1)) {
		throw new NodeOperationError(
			this.getNode(),
			'许可自动激活状态必须为0（关闭）或1（打开）',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		corpid,
		auto_active_status: autoActiveStatus,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/set_auto_active_status',
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
				`设置企业的许可自动激活状态失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`设置企业的许可自动激活状态失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
