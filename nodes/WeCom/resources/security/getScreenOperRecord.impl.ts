import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function getScreenOperRecord(this: IExecuteFunctions): Promise<IDataObject> {
	const startTimeParam = this.getNodeParameter('start_time', 0) as string | number;
	const endTimeParam = this.getNodeParameter('end_time', 0) as string | number;
	const useridList = this.getNodeParameter('userid_list', 0) as IDataObject;
	const departmentIdList = this.getNodeParameter('department_id_list', 0) as string[];
	const screenShotType = this.getNodeParameter('screen_shot_type', 0) as number;
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
	if (useridList.userids && Array.isArray(useridList.userids) && useridList.userids.length > 0) {
		body.userid_list = useridList.userids;
	}

	// 添加部门ID列表
	if (departmentIdList && Array.isArray(departmentIdList) && departmentIdList.length > 0) {
		body.department_id_list = departmentIdList.map((id) => parseInt(id, 10));
	}

	// 添加截屏内容类型
	if (screenShotType !== undefined && screenShotType !== null) {
		body.screen_shot_type = screenShotType;
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
		'/cgi-bin/security/get_screen_oper_record',
		body,
	);

	return responseData;
}
