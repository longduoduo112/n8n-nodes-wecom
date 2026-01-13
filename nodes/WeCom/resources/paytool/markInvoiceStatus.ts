import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 标记开票状态
 * 官方文档：https://developer.work.weixin.qq.com/document/path/99437
 *
 * 用途：
 * - 服务商可以使用该接口标记某个应用订单发票的开票状态
 *
 * 注意事项：
 * - 服务商需有在收银台完成商户号注册
 * - 此接口不需要签名，只需要provider_access_token
 * - 操作人需要有「收银台-发票管理」的权限
 * - 若订单对应开票状态为已开票，此次标记将不生效
 *
 * @returns 操作结果
 */
export async function markInvoiceStatus(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const orderId = this.getNodeParameter('orderId', index) as string;
	const operUserid = this.getNodeParameter('operUserid', index) as string;
	const invoiceStatus = this.getNodeParameter('invoiceStatus', index) as number;
	const invoiceNote = this.getNodeParameter('invoiceNote', index) as string;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!orderId) {
		throw new NodeOperationError(
			this.getNode(),
			'订单号不能为空',
			{ itemIndex: index },
		);
	}

	if (!operUserid) {
		throw new NodeOperationError(
			this.getNode(),
			'操作人userid不能为空',
			{ itemIndex: index },
		);
	}

	if (invoiceStatus !== 1 && invoiceStatus !== 2 && invoiceStatus !== 3) {
		throw new NodeOperationError(
			this.getNode(),
			'开票状态必须为1（已开具纸质发票）、2（已开具电子发票）或3（取消开具发票）',
			{ itemIndex: index },
		);
	}

	if (!invoiceNote) {
		throw new NodeOperationError(
			this.getNode(),
			'开票备注不能为空',
			{ itemIndex: index },
		);
	}

	const noteBytes = Buffer.byteLength(invoiceNote, 'utf8');
	if (noteBytes > 200) {
		throw new NodeOperationError(
			this.getNode(),
			`开票备注不能超过200字节，当前为${noteBytes}字节`,
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		order_id: orderId,
		oper_userid: operUserid,
		invoice_status: invoiceStatus,
		invoice_note: invoiceNote,
	};

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/paytool/mark_invoice_status`,
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
				`标记开票状态失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`标记开票状态失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}