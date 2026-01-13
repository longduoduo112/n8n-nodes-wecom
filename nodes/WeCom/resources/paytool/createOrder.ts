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
 * 创建收款订单
 * 官方文档：https://developer.work.weixin.qq.com/document/path/98045
 *
 * 用途：
 * - 服务商可以使用该接口创建各种业务的收款订单
 * - 支持普通第三方应用、代开发应用、行业解决方案三种业务类型
 *
 * 注意事项：
 * - 服务商需有在收银台完成商户号注册（支付方式为"免支付"的订单可以不受此限制）
 * - 需要提供收银台API调用密钥用于签名
 * - 签名算法：将所有非空参数构造成键值对，按字典序排序后拼接，然后进行HMAC-SHA256签名并base64编码
 * - 签名算法文档：https://developer.work.weixin.qq.com/document/path/98768
 *
 * @returns 订单信息（包含订单ID、订单链接、价格等）
 */
export async function createOrder(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const businessType = this.getNodeParameter('businessType', index) as number;
	const payType = this.getNodeParameter('payType', index) as number;
	const paytoolSecret = this.getNodeParameter('paytoolSecret', index) as string;
	const customCorpid = this.getNodeParameter('customCorpid', index) as string | undefined;
	const bankReceiptMediaId = this.getNodeParameter('bankReceiptMediaId', index) as
		| string
		| undefined;
	const creator = this.getNodeParameter('creator', index) as string | undefined;

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

	const body: IDataObject = {
		business_type: businessType,
		pay_type: payType,
	};

	if (customCorpid) {
		body.custom_corpid = customCorpid;
	}

	if (bankReceiptMediaId) {
		body.bank_receipt_media_id = bankReceiptMediaId;
	}

	if (creator) {
		body.creator = creator;
	}

	const productList: IDataObject = {};

	if (businessType === 1) {
		const thirdApp = this.getNodeParameter('thirdApp', index, {}) as IDataObject;
		const orderType = thirdApp.orderType as number;
		const buyInfoListCollection = thirdApp.buyInfoList as IDataObject | undefined;
		const buyInfoList = buyInfoListCollection?.apps as IDataObject[] | undefined;
		const notifyCustomCorp = thirdApp.notifyCustomCorp as number | undefined;

		if (!buyInfoList || buyInfoList.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'购买应用列表不能为空',
				{ itemIndex: index },
			);
		}

		if (buyInfoList.length > 20) {
			throw new NodeOperationError(
				this.getNode(),
				'购买应用列表最多20个',
				{ itemIndex: index },
			);
		}

		const formattedBuyInfoList: IDataObject[] = [];
		for (const buyInfo of buyInfoList) {
			const formattedBuyInfo: IDataObject = {
				suiteid: buyInfo.suiteid,
				edition_id: buyInfo.editionId,
			};

			if (buyInfo.appid !== undefined) {
				formattedBuyInfo.appid = buyInfo.appid;
			}

			if (buyInfo.userCount !== undefined) {
				formattedBuyInfo.user_count = buyInfo.userCount;
			}

			if (buyInfo.durationDays !== undefined) {
				formattedBuyInfo.duration_days = buyInfo.durationDays;
			}

			if (buyInfo.takeEffectDate) {
				formattedBuyInfo.take_effect_date = buyInfo.takeEffectDate;
			}

			if (buyInfo.discountInfo) {
				const discountInfo = buyInfo.discountInfo as IDataObject;
				const formattedDiscount: IDataObject = {
					discount_type: discountInfo.discountType,
					discount_remarks: discountInfo.discountRemarks,
				};

				if (discountInfo.discountAmount !== undefined) {
					formattedDiscount.discount_amount = discountInfo.discountAmount;
				}

				if (discountInfo.discountRatio !== undefined) {
					formattedDiscount.discount_ratio = discountInfo.discountRatio;
				}

				formattedBuyInfo.discount_info = formattedDiscount;
			}

			formattedBuyInfoList.push(formattedBuyInfo);
		}

		productList.third_app = {
			order_type: orderType,
			buy_info_list: formattedBuyInfoList,
		};

		if (notifyCustomCorp !== undefined) {
			(productList.third_app as IDataObject).notify_custom_corp = notifyCustomCorp;
		}
	} else if (businessType === 2) {
		if (!customCorpid) {
			throw new NodeOperationError(
				this.getNode(),
				'代开发应用必须指定客户企业corpid',
				{ itemIndex: index },
			);
		}

		const customizedApp = this.getNodeParameter('customizedApp', index, {}) as IDataObject;
		const orderType = customizedApp.orderType as number;
		const buyInfoListCollection = customizedApp.buyInfoList as IDataObject | undefined;
		const buyInfoList = buyInfoListCollection?.apps as IDataObject[] | undefined;
		const notifyCustomCorp = customizedApp.notifyCustomCorp as number | undefined;

		if (!buyInfoList || buyInfoList.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'购买应用列表不能为空',
				{ itemIndex: index },
			);
		}

		if (buyInfoList.length > 20) {
			throw new NodeOperationError(
				this.getNode(),
				'购买应用列表最多20个',
				{ itemIndex: index },
			);
		}

		const formattedBuyInfoList: IDataObject[] = [];
		for (const buyInfo of buyInfoList) {
			const formattedBuyInfo: IDataObject = {
				suiteid: buyInfo.suiteid,
				total_price: buyInfo.totalPrice,
			};

			if (buyInfo.userCount !== undefined) {
				formattedBuyInfo.user_count = buyInfo.userCount;
			}

			if (buyInfo.durationDays !== undefined) {
				formattedBuyInfo.duration_days = buyInfo.durationDays;
			}

			if (buyInfo.takeEffectDate) {
				formattedBuyInfo.take_effect_date = buyInfo.takeEffectDate;
			}

			formattedBuyInfoList.push(formattedBuyInfo);
		}

		productList.customized_app = {
			order_type: orderType,
			buy_info_list: formattedBuyInfoList,
		};

		if (notifyCustomCorp !== undefined) {
			(productList.customized_app as IDataObject).notify_custom_corp = notifyCustomCorp;
		}
	} else if (businessType === 3) {
		const promotionCase = this.getNodeParameter('promotionCase', index, {}) as IDataObject;
		const orderType = promotionCase.orderType as number;
		const caseId = promotionCase.caseId as string;
		const promotionEditionName = promotionCase.promotionEditionName as string;
		const buyInfoListCollection = promotionCase.buyInfoList as IDataObject | undefined;
		const buyInfoList = buyInfoListCollection?.apps as IDataObject[] | undefined;
		const notifyCustomCorp = promotionCase.notifyCustomCorp as number | undefined;

		if (!caseId) {
			throw new NodeOperationError(
				this.getNode(),
				'行业方案ID不能为空',
				{ itemIndex: index },
			);
		}

		if (!promotionEditionName) {
			throw new NodeOperationError(
				this.getNode(),
				'行业方案版本名不能为空',
				{ itemIndex: index },
			);
		}

		const formattedBuyInfoList: IDataObject[] = [];
		if (buyInfoList && buyInfoList.length > 0) {
			if (buyInfoList.length > 20) {
				throw new NodeOperationError(
					this.getNode(),
					'购买应用列表最多20个',
					{ itemIndex: index },
				);
			}

			for (const buyInfo of buyInfoList) {
				const formattedBuyInfo: IDataObject = {
					suiteid: buyInfo.suiteid,
				};

				if (buyInfo.appid !== undefined) {
					formattedBuyInfo.appid = buyInfo.appid;
				}

				if (buyInfo.userCount !== undefined) {
					formattedBuyInfo.user_count = buyInfo.userCount;
				}

				formattedBuyInfoList.push(formattedBuyInfo);
			}
		}

		productList.promotion_case = {
			order_type: orderType,
			case_id: caseId,
			promotion_edition_name: promotionEditionName,
			buy_info_list: formattedBuyInfoList,
		};

		if (promotionCase.durationDays !== undefined) {
			(productList.promotion_case as IDataObject).duration_days = promotionCase.durationDays;
		}

		if (promotionCase.takeEffectDate) {
			(productList.promotion_case as IDataObject).take_effect_date = promotionCase.takeEffectDate;
		}

		if (notifyCustomCorp !== undefined) {
			(productList.promotion_case as IDataObject).notify_custom_corp = notifyCustomCorp;
		}
	}

	body.product_list = productList;

	const nonceStr = randomBytes(16).toString('hex');
	const ts = Math.floor(Date.now() / 1000);

	body.nonce_str = nonceStr;
	body.ts = ts;

	const sig = generatePaytoolSignature(body, paytoolSecret);

	body.sig = sig;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/paytool/open_order`,
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
				`创建收款订单失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`创建收款订单失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}