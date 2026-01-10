import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { getRegisterCode } from './getRegisterCode';
import { getRegisterInfo } from './getRegisterInfo';
import { setAgentScope } from './setAgentScope';
import { setContactSyncSuccess } from './setContactSyncSuccess';

export async function executePromotionQrcode(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject = {};

			switch (operation) {
				case 'getRegisterCode':
					responseData = await getRegisterCode.call(this, i);
					break;
				case 'getRegisterInfo':
					responseData = await getRegisterInfo.call(this, i);
					break;
				case 'setAgentScope':
					responseData = await setAgentScope.call(this, i);
					break;
				case 'setContactSyncSuccess':
					responseData = await setContactSyncSuccess.call(this, i);
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
