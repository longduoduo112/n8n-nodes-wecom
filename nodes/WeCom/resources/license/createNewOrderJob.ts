import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 创建多企业新购任务
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98892
 *
 * 用途：
 * - 可以下单为多个企业购买新的账号，可以同时购买基础账号与互通账号
 * - 在同一个订单里，首次创建任务无须指定jobid，后续指定同一个jobid，表示往同一个订单任务追加新购的企业
 *
 * 注意事项：
 * - 测试企业不支持多企业下单方式
 * - 每次最多传10个企业，每个jobid最多关联100000个BuyInfo
 * - 基础账号跟互通账号不能同时为0
 * - 总购买时长为(months*31+days)天，最少购买1个月(31天)，最多购买60个月(1860天)
 *
 * @returns 任务信息（包含jobid和不合法的企业列表）
 */
export async function createNewOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const buyListCollection = this.getNodeParameter('buyListCollection', index, {}) as IDataObject;
	const jobid = this.getNodeParameter('jobid', index) as string | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	const buyList: IDataObject[] = [];
	if (buyListCollection.buyInfos) {
		const buyInfos = buyListCollection.buyInfos as IDataObject[];
		if (buyInfos.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'企业新购信息列表不能为空',
				{ itemIndex: index },
			);
		}
		if (buyInfos.length > 10) {
			throw new NodeOperationError(
				this.getNode(),
				'每次最多传10个企业',
				{ itemIndex: index },
			);
		}
		buyInfos.forEach((buyInfo) => {
			if (!buyInfo.corpid || (buyInfo.corpid as string).trim() === '') {
				throw new NodeOperationError(
					this.getNode(),
					'企业ID不能为空',
					{ itemIndex: index },
				);
			}

			const baseCount = buyInfo.baseCount as number | undefined;
			const externalContactCount = buyInfo.externalContactCount as number | undefined;

			if ((baseCount === undefined || baseCount === 0) && (externalContactCount === undefined || externalContactCount === 0)) {
				throw new NodeOperationError(
					this.getNode(),
					'基础账号和互通账号不能同时为0',
					{ itemIndex: index },
				);
			}

			const months = buyInfo.months as number | undefined;
			const days = buyInfo.days as number | undefined;

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

			const buyInfoData: IDataObject = {
				corpid: buyInfo.corpid,
				account_count: accountCount,
				account_duration: accountDuration,
			};

			if (buyInfo.autoActiveStatus !== undefined) {
				buyInfoData.auto_active_status = buyInfo.autoActiveStatus;
			}

			buyList.push(buyInfoData);
		});
	} else {
		throw new NodeOperationError(
			this.getNode(),
			'企业新购信息列表不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		buy_list: buyList,
	};

	if (jobid && jobid.trim() !== '') {
		body.jobid = jobid;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/license/create_new_order_job`,
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
				`创建多企业新购任务失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`创建多企业新购任务失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}