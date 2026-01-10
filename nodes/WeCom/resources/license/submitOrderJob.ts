import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 提交续期订单
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95646
 *
 * 用途：
 * - 创建续期任务之后，需要调用该接口，以提交订单任务
 * - 提交之后，需要到服务商管理端发起支付，支付完成之后，订单才能生效
 * - 也可以通过接口使用余额支付订单
 *
 * 注意事项：
 * - months 与 new_expire_time 二者填其一
 * - 购买的月数最多购买60个月
 * - 若企业为服务商测试企业，每次续期只能续期1个月
 * - new_expire_time 不可为今天和过去的时间，不可为1860天后的时间
 * - new_expire_time 须填当天的24时0分0秒，否则系统自动处理为当天的24时0分0秒
 * - 若企业为服务商测试企业，不支持指定新的到期时间来续期
 *
 * @returns 订单信息（包含订单号）
 */
export async function submitOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const jobid = this.getNodeParameter('jobid', index) as string;
	const buyerUserid = this.getNodeParameter('buyerUserid', index) as string;
	const durationType = this.getNodeParameter('durationType', index) as string;
	const months = this.getNodeParameter('months', index) as number | undefined;
	const newExpireTime = this.getNodeParameter('newExpireTime', index) as number | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!jobid) {
		throw new NodeOperationError(
			this.getNode(),
			'任务ID不能为空',
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

	const accountDuration: IDataObject = {};
	if (durationType === 'months') {
		if (months === undefined || months <= 0) {
			throw new NodeOperationError(
				this.getNode(),
				'购买月数必须大于0',
				{ itemIndex: index },
			);
		}
		if (months > 60) {
			throw new NodeOperationError(
				this.getNode(),
				'购买月数最多为60个月',
				{ itemIndex: index },
			);
		}
		accountDuration.months = months;
	} else if (durationType === 'newExpireTime') {
		if (newExpireTime === undefined || newExpireTime <= 0) {
			throw new NodeOperationError(
				this.getNode(),
				'新到期时间戳必须大于0',
				{ itemIndex: index },
			);
		}
		const now = Math.floor(Date.now() / 1000);
		const today = new Date();
		today.setHours(0, 0, 0, 0);
		const todayTimestamp = Math.floor(today.getTime() / 1000);
		if (newExpireTime < todayTimestamp) {
			throw new NodeOperationError(
				this.getNode(),
				'新到期时间不能为过去的时间',
				{ itemIndex: index },
			);
		}
		const maxTimestamp = now + 1860 * 24 * 60 * 60;
		if (newExpireTime > maxTimestamp) {
			throw new NodeOperationError(
				this.getNode(),
				'新到期时间不能超过1860天后',
				{ itemIndex: index },
			);
		}
		accountDuration.new_expire_time = newExpireTime;
	} else {
		throw new NodeOperationError(
			this.getNode(),
			'必须指定购买月数或新到期时间',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/submit_order_job',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			jobid,
			buyer_userid: buyerUserid,
			account_duration: accountDuration,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`提交续期订单失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`提交续期订单失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
