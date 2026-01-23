import type { IExecuteFunctions, INodeExecutionData , IDataObject  } from 'n8n-workflow';


import { getFileOperRecord } from './getFileOperRecord.impl';
import { importDevice } from './importDevice.impl';
import { getDeviceList } from './getDeviceList.impl';
import { getDeviceByUser } from './getDeviceByUser.impl';
import { deleteDevice } from './deleteDevice.impl';
import { approveDevice } from './approveDevice.impl';
import { rejectDevice } from './rejectDevice.impl';
import { getScreenOperRecord } from './getScreenOperRecord.impl';
import { getVipList } from './getVipList.impl';
import { submitBatchAddVipJob } from './submitBatchAddVipJob.impl';
import { batchAddVipJobResult } from './batchAddVipJobResult.impl';
import { submitBatchDelVipJob } from './submitBatchDelVipJob.impl';
import { batchDelVipJobResult } from './batchDelVipJobResult.impl';
import { getMemberOperLog } from './getMemberOperLog.impl';
import { getAdminOperLog } from './getAdminOperLog.impl';
import { getServerDomainIp } from './getServerDomainIp.impl';

export async function executeSecurity(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject[]> {
	const operation = this.getNodeParameter('operation', index) as string;

	let responseData: IDataObject = {};

	switch (operation) {
		case 'getFileOperRecord':
			responseData = await getFileOperRecord.call(this);
			break;
		case 'importDevice':
			responseData = await importDevice.call(this);
			break;
		case 'getDeviceList':
			responseData = await getDeviceList.call(this);
			break;
		case 'getDeviceByUser':
			responseData = await getDeviceByUser.call(this);
			break;
		case 'deleteDevice':
			responseData = await deleteDevice.call(this);
			break;
		case 'approveDevice':
			responseData = await approveDevice.call(this);
			break;
		case 'rejectDevice':
			responseData = await rejectDevice.call(this);
			break;
		case 'getScreenOperRecord':
			responseData = await getScreenOperRecord.call(this);
			break;
		case 'getVipList':
			responseData = await getVipList.call(this);
			break;
		case 'submitBatchAddVipJob':
			responseData = await submitBatchAddVipJob.call(this);
			break;
		case 'batchAddVipJobResult':
			responseData = await batchAddVipJobResult.call(this);
			break;
		case 'submitBatchDelVipJob':
			responseData = await submitBatchDelVipJob.call(this);
			break;
		case 'batchDelVipJobResult':
			responseData = await batchDelVipJobResult.call(this);
			break;
		case 'getMemberOperLog':
			responseData = await getMemberOperLog.call(this);
			break;
		case 'getAdminOperLog':
			responseData = await getAdminOperLog.call(this);
			break;
		case 'getServerDomainIp':
			responseData = await getServerDomainIp.call(this);
			break;
		default:
			throw new Error(`未知操作: ${operation}`);
	}

	return [responseData];
}

export async function executeSecurityAll(
	this: IExecuteFunctions,
	index: number,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const operation = this.getNodeParameter('operation', index) as string;
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData: IDataObject;

			switch (operation) {
				case 'getFileOperRecord':
					responseData = await getFileOperRecord.call(this);
					break;
				case 'importDevice':
					responseData = await importDevice.call(this);
					break;
				case 'getDeviceList':
					responseData = await getDeviceList.call(this);
					break;
				case 'getDeviceByUser':
					responseData = await getDeviceByUser.call(this);
					break;
				case 'deleteDevice':
					responseData = await deleteDevice.call(this);
					break;
				case 'approveDevice':
					responseData = await approveDevice.call(this);
					break;
				case 'rejectDevice':
					responseData = await rejectDevice.call(this);
					break;
				case 'getScreenOperRecord':
					responseData = await getScreenOperRecord.call(this);
					break;
				case 'getVipList':
					responseData = await getVipList.call(this);
					break;
				case 'submitBatchAddVipJob':
					responseData = await submitBatchAddVipJob.call(this);
					break;
				case 'batchAddVipJobResult':
					responseData = await batchAddVipJobResult.call(this);
					break;
				case 'submitBatchDelVipJob':
					responseData = await submitBatchDelVipJob.call(this);
					break;
				case 'batchDelVipJobResult':
					responseData = await batchDelVipJobResult.call(this);
					break;
				case 'getMemberOperLog':
					responseData = await getMemberOperLog.call(this);
					break;
				case 'getAdminOperLog':
					responseData = await getAdminOperLog.call(this);
					break;
				case 'getServerDomainIp':
					responseData = await getServerDomainIp.call(this);
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
					json: { error: error.message },
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
