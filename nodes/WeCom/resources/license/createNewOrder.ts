import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 下单购买账号
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95644
 *
 * 用途：
 * - 服务商下单为企业购买新的账号，可以同时购买基础账号与互通账号
 * - 下单之后，需要到服务商管理端发起支付，支付完成之后，订单才能生效
 * - 也可以通过接口使用余额支付订单
 *
 * 注意事项：
 * - 自2023年6月30日起，服务商为企业购买接口许可时，会检查企业下的应用订单情况
 * - 应用订单检查通过时才可购买接口许可
 * - 关联应用订单失败时，返回的errmsg将包含有"WARNING"字段
 * - 基础账号跟互通账号不能同时为0
 * - 总购买时长为(months*31+days)天，最少购买1个月(31天)，最多购买60个月(1860天)
 * - 若企业为服务商测试企业，只支持购买1个月，不支持指定天购买
 *
 * @returns 订单信息（包含订单号）
 */
export async function createNewOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const buyerUserid = this.getNodeParameter('buyerUserid', index) as string;
	const baseCount = this.getNodeParameter('baseCount', index) as number;
	const externalContactCount = this.getNodeParameter('externalContactCount', index) as number;
	const months = this.getNodeParameter('months', index) as number;
	const days = this.getNodeParameter('days', index) as number;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!corpid) {
		throw new NodeOperationError(
			this.getNode(),
			'企业ID不能为空',
			{ itemIndex: index },
		);
	}

	if (!buyerUserid) {
		throw new NodeOperationError(
			this.getNode(),
			'下单人不能为空',
			{ itemIndex: index },
		);
	}

	// 基础账号跟互通账号不能同时为0
	if ((baseCount === undefined || baseCount === 0) && (externalContactCount === undefined || externalContactCount === 0)) {
		throw new NodeOperationError(
			this.getNode(),
			'基础账号和互通账号不能同时为0',
			{ itemIndex: index },
		);
	}

	// 验证购买时长：最少1个月(31天)，最多60个月(1860天)
	const totalDays = (months || 0) * 31 + (days || 0);
	if (totalDays < 31) {
		throw new NodeOperationError(
			this.getNode(),
			'购买时长最少为1个月(31天)',
			{ itemIndex: index },
		);
	}
	if (totalDays > 1860) {
		throw new NodeOperationError(
			this.getNode(),
			'购买时长最多为60个月(1860天)',
			{ itemIndex: index },
		);
	}

	const accountCount: IDataObject = {};
	if (baseCount !== undefined && baseCount > 0) {
		accountCount.base_count = baseCount;
	}
	if (externalContactCount !== undefined && externalContactCount > 0) {
		accountCount.external_contact_count = externalContactCount;
	}

	const accountDuration: IDataObject = {};
	if (months !== undefined && months >= 0) {
		accountDuration.months = months;
	}
	if (days !== undefined && days >= 0) {
		accountDuration.days = days;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/create_new_order',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
			buyer_userid: buyerUserid,
			account_count: accountCount,
			account_duration: accountDuration,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`下单购买账号失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`下单购买账号失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
