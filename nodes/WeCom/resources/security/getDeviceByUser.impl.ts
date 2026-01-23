import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function getDeviceByUser(this: IExecuteFunctions): Promise<IDataObject> {
	const lastLoginUserid = this.getNodeParameter('last_login_userid', 0) as string;
	const type = this.getNodeParameter('type', 0) as number;

	const body = {
		last_login_userid: lastLoginUserid,
		type: type,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/trustdevice/get_by_user',
		body,
	);

	return responseData;
}
