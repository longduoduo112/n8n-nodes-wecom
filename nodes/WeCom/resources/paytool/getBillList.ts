import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取代支付流水
 * 官方文档：https://developer.work.weixin.qq.com/document/path/99602
 *
 * 用途：
 * - 服务商可通过此接口获取使用量代付流水
 * - 企业通过代付产生使用量后，次日可在获客助手中查看代付的订单记录
 *
 * 注意事项：
 * - 需要suite_access_token（获客助手组件的应用凭证）
 * - 流水的起止间隔不能超过31天
 * - 若需要与企业侧使用量统计周期一致，请按当天的0时0分01秒到第二天的0时0分0秒的时间戳查询
 *
 * @returns 代支付流水记录列表
 */
export async function getBillList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = this.getNodeParameter('suiteAccessToken', index) as string;
	const beginTime = this.getNodeParameter('beginTime', index) as number;
	const endTime = this.getNodeParameter('endTime', index) as number;
	const authCorpid = this.getNodeParameter('authCorpid', index) as string;
	const cursor = this.getNodeParameter('cursor', index, '') as string | undefined;
	const limit = this.getNodeParameter('limit', index, 100) as number | undefined;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!beginTime) {
		throw new NodeOperationError(
			this.getNode(),
			'流水记录开始时间不能为空',
			{ itemIndex: index },
		);
	}

	if (!endTime) {
		throw new NodeOperationError(
			this.getNode(),
			'流水记录结束时间不能为空',
			{ itemIndex: index },
		);
	}

	if (!authCorpid) {
		throw new NodeOperationError(
			this.getNode(),
			'授权企业corpid不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		begin_time: beginTime,
		end_time: endTime,
		auth_corpid: authCorpid,
	};

	if (cursor) {
		body.cursor = cursor;
	}

	if (limit) {
		body.limit = limit;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/customer_acquisition/get_bill_list`,
		qs: {
			suite_access_token: suiteAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`获取代支付流水失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取代支付流水失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
