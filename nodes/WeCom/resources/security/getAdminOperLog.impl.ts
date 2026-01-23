import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function getAdminOperLog(this: IExecuteFunctions): Promise<IDataObject> {
	const startTimeParam = this.getNodeParameter('start_time', 0) as string | number;
	const endTimeParam = this.getNodeParameter('end_time', 0) as string | number;
	const operType = this.getNodeParameter('oper_type', 0) as number;
	const userid = this.getNodeParameter('userid', 0) as string;
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

	// 添加操作类型
	if (operType !== undefined && operType !== null) {
		body.oper_type = operType;
	}

	// 添加用户ID
	if (userid) {
		body.userid = userid;
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
		'/cgi-bin/security/admin_oper_log/list',
		body,
	);

	return responseData;
}
