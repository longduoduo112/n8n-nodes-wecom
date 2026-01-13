import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 分配激活码给下游/下级企业
 * 官方文档：https://developer.work.weixin.qq.com/document/path/96059
 *
 * 用途：
 * - 服务商可调用该接口将为上游/上级企业购买的激活码分配给下游/下级企业使用
 *
 * 注意事项：
 * - 目前支持的场景包括企微上下游和企业互联(含局校互联)
 * - 上游/上级企业有共享该服务商的第三方应用或代开发应用给下游/下级企业
 * - 分配给下游/下级企业的激活码，当前未激活，且属于上游/上级企业的，且未分配给其他下游/下级企业
 * - 每次调用接口分配的激活码账号数，不能超过下游/下级企业在上下游/企业互联通讯录中人数上限的两倍
 * - 每次分配激活码不可超过1000个
 * - corp_link_type：0：上下游，1：企业互联，默认0
 *
 * @returns 分配结果（包含分配结果列表，仅分配失败的会返回）
 */
export async function batchShareActiveCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const fromCorpid = this.getNodeParameter('fromCorpid', index) as string;
	const toCorpid = this.getNodeParameter('toCorpid', index) as string;
	const shareListCollection = this.getNodeParameter('shareListCollection', index, {}) as IDataObject;
	const corpLinkType = this.getNodeParameter('corpLinkType', index, 0) as number;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!fromCorpid || fromCorpid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'上游/上级企业ID不能为空',
			{ itemIndex: index },
		);
	}

	if (!toCorpid || toCorpid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'下游/下级企业ID不能为空',
			{ itemIndex: index },
		);
	}

	const shareList: IDataObject[] = [];
	if (shareListCollection.codes) {
		const codes = shareListCollection.codes as IDataObject[];
		if (codes.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'分配的接口许可列表不能为空',
				{ itemIndex: index },
			);
		}
		if (codes.length > 1000) {
			throw new NodeOperationError(
				this.getNode(),
				'每次分配激活码不可超过1000个',
				{ itemIndex: index },
			);
		}
		codes.forEach((code) => {
			if (!code.activeCode || (code.activeCode as string).trim() === '') {
				throw new NodeOperationError(
					this.getNode(),
					'激活码不能为空',
					{ itemIndex: index },
				);
			}
			shareList.push({
				active_code: code.activeCode,
			});
		});
	} else {
		throw new NodeOperationError(
			this.getNode(),
			'分配的接口许可列表不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		from_corpid: fromCorpid,
		to_corpid: toCorpid,
		share_list: shareList,
	};

	if (corpLinkType !== undefined && (corpLinkType === 0 || corpLinkType === 1)) {
		body.corp_link_type = corpLinkType;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/batch_share_active_code`,
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
				`分配激活码给下游/下级企业失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`分配激活码给下游/下级企业失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}