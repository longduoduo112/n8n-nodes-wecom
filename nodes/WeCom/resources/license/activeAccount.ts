import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 激活账号
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95553
 *
 * 用途：
 * - 下单购买账号并支付完成之后，先调用获取订单中的账号列表接口获取到账号激活码
 * - 然后可以调用该接口将激活码绑定到某个企业员工，以对其激活相应的平台服务能力
 *
 * 注意事项：
 * - 一个userid允许激活一个基础账号以及一个互通账号
 * - 若userid已激活，使用同类型的激活码来激活后，则绑定关系变为新激活码，新激活码有效时长自动叠加上旧激活码剩余时长，同时旧激活码失效
 * - 多个同类型的激活码累加后的有效期不可超过5年，否则接口报错701030
 * - 只有当旧的激活码的剩余时长小于等于20天，才可以使用新的同类型的激活码进行激活并续期
 *
 * @returns 操作结果
 */
export async function activeAccount(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const activeCode = this.getNodeParameter('activeCode', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const userid = this.getNodeParameter('userid', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!activeCode || activeCode.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'账号激活码不能为空',
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
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/active_account',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			active_code: activeCode,
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
				`激活账号失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`激活账号失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
