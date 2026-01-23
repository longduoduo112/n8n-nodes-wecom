import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function getVipList(this: IExecuteFunctions): Promise<IDataObject> {
	const cursor = this.getNodeParameter('cursor', 0) as string;
	const limit = this.getNodeParameter('limit', 0) as number;

	const body: IDataObject = {};

	if (cursor) {
		body.cursor = cursor;
	}

	if (limit) {
		body.limit = limit;
	}

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/vip/list',
		body,
	);

	return responseData;
}
