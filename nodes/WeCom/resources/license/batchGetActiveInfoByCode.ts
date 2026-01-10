import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 批量获取激活码详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95552
 *
 * 用途：
 * - 批量查询账号激活码的状态以及激活绑定情况
 *
 * 注意事项：
 * - 激活码列表最多不超过1000个
 * - 账号类型：1:基础账号，2:互通账号
 * - 账号状态：
 *   1: 未绑定
 *   2: 已绑定且有效
 *   3: 已过期
 *   4: 待转移
 *   5: 已合并
 *   6: 已分配给下游
 *
 * @returns 激活码详情列表和无效的激活码列表
 */
export async function batchGetActiveInfoByCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const activeCodeListRaw = this.getNodeParameter('activeCodeList', index) as string;

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

	if (!activeCodeListRaw || activeCodeListRaw.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'激活码列表不能为空',
			{ itemIndex: index },
		);
	}

	const activeCodeList = activeCodeListRaw
		.split(',')
		.map((code) => code.trim())
		.filter((code) => code !== '');

	if (activeCodeList.length === 0) {
		throw new NodeOperationError(
			this.getNode(),
			'激活码列表不能为空',
			{ itemIndex: index },
		);
	}

	if (activeCodeList.length > 1000) {
		throw new NodeOperationError(
			this.getNode(),
			'激活码列表最多不超过1000个',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/batch_get_active_info_by_code',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
			active_code_list: activeCodeList,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`批量获取激活码详情失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`批量获取激活码详情失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
