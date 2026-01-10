import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 批量激活账号
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95553
 *
 * 用途：
 * - 可在一次请求里为一个企业的多个成员激活许可账号，便于服务商批量化处理
 *
 * 注意事项：
 * - 一个userid允许激活一个基础账号以及一个互通账号
 * - 若userid已激活，使用同类型的激活码来激活后，则绑定关系变为新激活码，新激活码有效时长自动叠加上旧激活码剩余时长，同时旧激活码失效
 * - 多个同类型的激活码累加后的有效期不可超过5年，否则接口报错701030
 * - 只有当旧的激活码的剩余时长小于等于20天，才可以使用新的同类型的激活码进行激活并续期
 * - 单次激活的员工数量不超过1000
 *
 * @returns 激活结果（包含激活结果列表）
 */
export async function batchActiveAccount(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const activeListCollection = this.getNodeParameter('activeListCollection', index, {}) as IDataObject;

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

	const activeList: IDataObject[] = [];
	if (activeListCollection.accounts) {
		const accounts = activeListCollection.accounts as IDataObject[];
		if (accounts.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'激活账号列表不能为空',
				{ itemIndex: index },
			);
		}
		if (accounts.length > 1000) {
			throw new NodeOperationError(
				this.getNode(),
				'单次激活的员工数量不超过1000',
				{ itemIndex: index },
			);
		}
		accounts.forEach((account) => {
			if (!account.activeCode || (account.activeCode as string).trim() === '') {
				throw new NodeOperationError(
					this.getNode(),
					'账号激活码不能为空',
					{ itemIndex: index },
				);
			}
			if (!account.userid || (account.userid as string).trim() === '') {
				throw new NodeOperationError(
					this.getNode(),
					'企业成员userid不能为空',
					{ itemIndex: index },
				);
			}
			activeList.push({
				active_code: account.activeCode,
				userid: account.userid,
			});
		});
	} else {
		throw new NodeOperationError(
			this.getNode(),
			'激活账号列表不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/batch_active_account',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
			active_list: activeList,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`批量激活账号失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`批量激活账号失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
