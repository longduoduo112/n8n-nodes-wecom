import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取激活码详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95552
 *
 * 用途：
 * - 查询某个账号激活码的状态以及激活绑定情况
 *
 * 注意事项：
 * - 账号类型：1:基础账号，2:互通账号
 * - 账号状态：
 *   1: 未绑定
 *   2: 已绑定且有效
 *   3: 已过期
 *   4: 待转移
 *   5: 已合并
 *   6: 已分配给下游
 *
 * @returns 激活码详情信息
 */
export async function getActiveInfoByCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const activeCode = this.getNodeParameter('activeCode', index) as string;

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

	if (!activeCode || activeCode.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'激活码不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/get_active_info_by_code`,
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
			active_code: activeCode,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取激活码详情失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取激活码详情失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}