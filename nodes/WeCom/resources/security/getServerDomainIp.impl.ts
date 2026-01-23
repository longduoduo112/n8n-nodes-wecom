import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function getServerDomainIp(this: IExecuteFunctions): Promise<IDataObject> {
	const responseData = await weComApiRequest.call(
		this,
		'GET',
		'/cgi-bin/security/get_server_domain_ip',
	);

	return responseData;
}
