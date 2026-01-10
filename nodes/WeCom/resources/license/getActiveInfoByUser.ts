import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取成员的激活详情
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95555
 *
 * 用途：
 * - 查询某个企业成员的激活情况
 *
 * 注意事项：
 * - active_status：0：未激活，1：已激活
 * - 账号类型：1:基础账号，2:互通账号
 * - 同一个userid同类账号最多只能有一个
 *
 * @returns 成员的激活详情信息（包含激活状态和账号列表）
 */
export async function getActiveInfoByUser(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const userid = this.getNodeParameter('userid', index) as string;

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

	if (!userid || userid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'企业成员userid不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/get_active_info_by_user',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
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
				`获取成员的激活详情失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取成员的激活详情失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
