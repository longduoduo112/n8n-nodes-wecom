import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function getNewExternalUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalUseridList = this.getNodeParameter('externalUseridList', index) as string[];

	const body: IDataObject = {
		external_userid_list: externalUseridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/externalcontact/get_new_external_userid',
		body,
	);

	return responseData;
}
