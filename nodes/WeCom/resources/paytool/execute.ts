import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { createOrder } from './createOrder';
import { cancelOrder } from './cancelOrder';
import { getOrderList } from './getOrderList';
import { getOrderDetail } from './getOrderDetail';
import { getInvoiceList } from './getInvoiceList';
import { markInvoiceStatus } from './markInvoiceStatus';

/**
 * 执行第三方应用收银台相关操作
 */
export async function executePaytool(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
				case 'createOrder':
					responseData = await createOrder.call(this, i);
					break;
				case 'cancelOrder':
					responseData = await cancelOrder.call(this, i);
					break;
				case 'getOrderList':
					responseData = await getOrderList.call(this, i);
					break;
				case 'getOrderDetail':
					responseData = await getOrderDetail.call(this, i);
					break;
				case 'getInvoiceList':
					responseData = await getInvoiceList.call(this, i);
					break;
				case 'markInvoiceStatus':
					responseData = await markInvoiceStatus.call(this, i);
					break;
				default:
					throw new Error(`未知操作: ${operation}`);
			}

			returnData.push({
				json: responseData,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: (error as Error).message,
						success: false,
					},
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
