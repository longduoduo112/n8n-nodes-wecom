import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { createHmac, randomBytes } from 'crypto';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 递归扁平化JSON对象为键值对数组
 * 对于数组，递归处理每个元素的子节点（不直接使用数组本身）
 *
 * @param obj - 要扁平化的对象
 * @param pairs - 键值对数组（输出参数）
 */
function flattenObject(obj: unknown, pairs: string[] = []): void {
	if (obj === null || obj === undefined) {
		return;
	}

	if (Array.isArray(obj)) {
		for (const item of obj) {
			if (typeof item === 'object' && item !== null) {
				flattenObject(item, pairs);
			} else {
				pairs.push(`${String(item)}`);
			}
		}
	} else if (typeof obj === 'object') {
		for (const [key, value] of Object.entries(obj)) {
			if (value === null || value === undefined) {
				continue;
			} else if (Array.isArray(value)) {
				flattenObject(value, pairs);
			} else if (typeof value === 'object') {
				flattenObject(value, pairs);
			} else {
				pairs.push(`${key}=${String(value)}`);
			}
		}
	} else {
		pairs.push(`${String(obj)}`);
	}
}

/**
 * 生成收银台API签名
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98768
 *
 * 签名算法：
 * 1. 将所有非空参数构造成键值对（key=value），按照ASCII码从小到大排序（字典序）
 * 2. 拼接成字符串stringA
 * 3. 对stringA以服务商的支付密钥为key进行HMAC-SHA256运算，并进行base64编码
 * 4. sig参数不参与签名
 *
 * @param body - 请求体对象（不包含sig）
 * @param secret - 收银台API调用密钥
 * @returns 签名字符串（Base64编码）
 */
function generatePaytoolSignature(body: IDataObject, secret: string): string {
	const bodyWithoutSig = { ...body };
	delete bodyWithoutSig.sig;

	const pairs: string[] = [];
	flattenObject(bodyWithoutSig, pairs);

	pairs.sort();

	const stringA = pairs.join('&');

	const hmac = createHmac('sha256', secret);
	hmac.update(stringA);
	const signature = hmac.digest('base64');

	return signature;
}

/**
 * 获取收款订单列表
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98053
 *
 * 用途：
 * - 服务商可以使用该接口查询指定时间段内创建的各种业务的收款订单列表
 *
 * 注意事项：
 * - 无特殊权限要求
 * - 需要提供收银台API调用密钥用于签名
 * - 签名算法：将所有非空参数构造成键值对，按字典序排序后拼接，然后进行HMAC-SHA256签名并base64编码
 * - 签名算法文档：https://developer.work.weixin.qq.com/document/path/98768
 *
 * @returns 订单列表信息
 */
export async function getOrderList(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const paytoolSecret = this.getNodeParameter('paytoolSecret', index) as string;
	const limit = this.getNodeParameter('limit', index) as number;
	const businessType = this.getNodeParameter('businessType', index) as number | undefined;
	const startTime = this.getNodeParameter('startTime', index) as number | undefined;
	const endTime = this.getNodeParameter('endTime', index) as number | undefined;
	const cursor = this.getNodeParameter('cursor', index) as string | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!paytoolSecret) {
		throw new NodeOperationError(
			this.getNode(),
			'收银台API调用密钥不能为空',
			{ itemIndex: index },
		);
	}

	if (!limit || limit < 1 || limit > 2000) {
		throw new NodeOperationError(
			this.getNode(),
			'分页数量必须在1-2000之间',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		limit,
	};

	if (businessType !== undefined) {
		body.business_type = businessType;
	}

	if (startTime !== undefined) {
		body.start_time = startTime;
	}

	if (endTime !== undefined) {
		body.end_time = endTime;
	}

	if (cursor) {
		body.cursor = cursor;
	}

	const nonceStr = randomBytes(16).toString('hex');
	const ts = Math.floor(Date.now() / 1000);

	body.nonce_str = nonceStr;
	body.ts = ts;

	const sig = generatePaytoolSignature(body, paytoolSecret);

	body.sig = sig;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/paytool/get_order_list`,
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
				`获取收款订单列表失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取收款订单列表失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}