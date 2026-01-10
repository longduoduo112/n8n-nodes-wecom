import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function externalTagidToOpenExternalTagid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalTagidList = this.getNodeParameter('externalTagidList', index) as string[];

	const body: IDataObject = {
		external_tagid_list: externalTagidList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/external_tagid',
		body,
	);

	return responseData;
}
