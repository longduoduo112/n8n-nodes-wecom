import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

// 辅助函数：将dateTime转换为Unix时间戳（秒级）
function dateTimeToUnixTimestamp(dateTime: string | number): number {
	if (typeof dateTime === 'number') {
		return dateTime;
	}
	if (!dateTime || dateTime === '') {
		return 0;
	}
	return Math.floor(new Date(dateTime).getTime() / 1000);
}

export async function executePhone(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'getDialRecord') {
				const startTime = dateTimeToUnixTimestamp(this.getNodeParameter('start_time', i, '') as string | number);
				const endTime = dateTimeToUnixTimestamp(this.getNodeParameter('end_time', i, '') as string | number);
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = {};
				if (startTime && startTime > 0) {
					body.start_time = startTime;
				}
				if (endTime && endTime > 0) {
					body.end_time = endTime;
				}
				if (offset !== undefined) {
					body.offset = offset;
				}
				if (limit !== undefined) {
					body.limit = limit;
				}

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/dial/get_dial_record',
					body,
				);
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
