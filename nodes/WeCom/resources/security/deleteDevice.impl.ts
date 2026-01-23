import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function deleteDevice(this: IExecuteFunctions): Promise<IDataObject> {
	const type = this.getNodeParameter('type', 0) as number;
	const deviceCodeList = this.getNodeParameter('device_code_list', 0) as string[];

	const body = {
		type: type,
		device_code_list: deviceCodeList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/trustdevice/delete',
		body,
	);

	return responseData;
}
