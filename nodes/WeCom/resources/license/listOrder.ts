import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取订单列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95647
 *
 * 用途：
 * - 服务商查询自己某段时间内的平台能力服务订单列表
 * - 支持分页查询
 * - 支持按企业ID筛选（测试企业或正式企业）
 *
 * 注意事项：
 * - start_time 和 end_time 必须同时指定，不能单独指定
 * - 起始时间跟结束时间不能超过31天
 * - limit 最大值1000，默认值500
 * - 订单类型：1：购买账号，2：续期账号，5：历史企业迁移订单，8：多企业新购订单
 *
 * @returns 订单列表信息（包含订单列表、分页游标等）
 */
export async function listOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string | undefined;
	const startTimeRaw = this.getNodeParameter('startTime', index) as number | undefined;
	const endTimeRaw = this.getNodeParameter('endTime', index) as number | undefined;
	const cursor = this.getNodeParameter('cursor', index) as string | undefined;
	const limit = this.getNodeParameter('limit', index, 500) as number;

	const startTime = startTimeRaw && startTimeRaw > 0 ? startTimeRaw : undefined;
	const endTime = endTimeRaw && endTimeRaw > 0 ? endTimeRaw : undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if ((startTime !== undefined && endTime === undefined) || (startTime === undefined && endTime !== undefined)) {
		throw new NodeOperationError(
			this.getNode(),
			'开始时间和结束时间必须同时指定，不能单独指定',
			{ itemIndex: index },
		);
	}

	if (startTime !== undefined && endTime !== undefined) {
		if (endTime <= startTime) {
			throw new NodeOperationError(
				this.getNode(),
				'结束时间必须大于开始时间',
				{ itemIndex: index },
			);
		}
		const daysDiff = (endTime - startTime) / (24 * 60 * 60);
		if (daysDiff > 31) {
			throw new NodeOperationError(
				this.getNode(),
				'起始时间跟结束时间不能超过31天',
				{ itemIndex: index },
			);
		}
	}

	if (limit < 1 || limit > 1000) {
		throw new NodeOperationError(
			this.getNode(),
			'返回的最大记录数必须在1-1000之间',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		limit,
	};

	if (corpid && corpid.trim() !== '') {
		body.corpid = corpid;
	}

	if (startTime !== undefined && endTime !== undefined) {
		body.start_time = startTime;
		body.end_time = endTime;
	}

	if (cursor && cursor.trim() !== '') {
		body.cursor = cursor;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/list_order',
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
				`获取订单列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取订单列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
