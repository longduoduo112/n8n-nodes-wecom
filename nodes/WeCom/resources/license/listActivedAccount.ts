import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取企业的账号列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95544
 *
 * 用途：
 * - 查询指定企业下的平台能力服务账号列表
 * - 支持分页查询
 *
 * 注意事项：
 * - 若为上下游场景，corpid指定的为上游企业，仅返回上游企业激活的账号
 * - 若corpid指定为下游企业，若激活码为上游企业分享过来的且已绑定，也会返回
 * - limit 最大值1000，默认值500
 * - 账号类型：1:基础账号，2:互通账号
 * - 已激活过期的账号也会返回
 *
 * @returns 企业的账号列表信息（包含已激活成员列表、分页游标等）
 */
export async function listActivedAccount(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const cursor = this.getNodeParameter('cursor', index) as string | undefined;
	const limit = this.getNodeParameter('limit', index, 500) as number;

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

	if (limit < 1 || limit > 1000) {
		throw new NodeOperationError(
			this.getNode(),
			'返回的最大记录数必须在1-1000之间',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		corpid,
		limit,
	};

	if (cursor && cursor.trim() !== '') {
		body.cursor = cursor;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/list_actived_account`,
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
				`获取企业的账号列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取企业的账号列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}