import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function getFileOperRecord(this: IExecuteFunctions): Promise<IDataObject> {
	const startTimeParam = this.getNodeParameter('start_time', 0) as string | number;
	const endTimeParam = this.getNodeParameter('end_time', 0) as string | number;
	const useridList = this.getNodeParameter('userid_list', 0) as IDataObject;
	const operationType = this.getNodeParameter('operation_type', 0) as IDataObject;
	const cursor = this.getNodeParameter('cursor', 0) as string;
	const limit = this.getNodeParameter('limit', 0) as number;

	// 将日期时间转换为秒级时间戳
	const startTime = typeof startTimeParam === 'string'
		? Math.floor(new Date(startTimeParam).getTime() / 1000)
		: startTimeParam;
	const endTime = typeof endTimeParam === 'string'
		? Math.floor(new Date(endTimeParam).getTime() / 1000)
		: endTimeParam;

	const body: IDataObject = {
		start_time: startTime,
		end_time: endTime,
	};

	// 添加用户ID列表
	if (Array.isArray(useridList) && useridList.length > 0) {
		body.userid_list = useridList;
	}

	// 添加操作类型过滤条件
	if (operationType.type !== undefined || operationType.source !== undefined) {
		const operation: IDataObject = {};
		if (operationType.type !== undefined) {
			operation.type = operationType.type;
		}
		if (operationType.source !== undefined) {
			operation.source = operationType.source;
		}
		body.operation = operation;
	}

	// 添加游标
	if (cursor) {
		body.cursor = cursor;
	}

	// 添加限制条数
	if (limit) {
		body.limit = limit;
	}

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/get_file_oper_record',
		body,
	);

	return responseData;
}
