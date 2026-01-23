import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function approveDevice(this: IExecuteFunctions): Promise<IDataObject> {
	const deviceCodeList = this.getNodeParameter('device_code_list', 0) as string[];

	const body = {
		device_code_list: deviceCodeList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/trustdevice/approve',
		body,
	);

	return responseData;
}
