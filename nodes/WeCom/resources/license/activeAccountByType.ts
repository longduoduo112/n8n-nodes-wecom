import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 指定账号类型激活
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95553
 *
 * 用途：
 * - userid当前必须未激活指定类型的许可或者绑定的该类型账号已过期
 * - 从当前企业中选择一个该指定类型的激活截止时间最早的未激活的激活码进行激活
 *
 * 注意事项：
 * - 账号类型：1：基础账号，2：互通账号
 * - userid当前必须未激活指定类型的许可或者绑定的该类型账号已过期
 *
 * @returns 操作结果
 */
export async function activeAccountByType(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const type = this.getNodeParameter('type', index) as number;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const userid = this.getNodeParameter('userid', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (type !== 1 && type !== 2) {
		throw new NodeOperationError(
			this.getNode(),
			'账号类型必须为1（基础账号）或2（互通账号）',
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

	if (!userid || userid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'企业成员userid不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/active_account_by_type',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			type,
			corpid,
			userid,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`指定账号类型激活失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`指定账号类型激活失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
