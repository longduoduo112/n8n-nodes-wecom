import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function openKfidToNewOpenKfid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const openKfidList = this.getNodeParameter('openKfidList', index) as string[];

	const body: IDataObject = {
		open_kfid_list: openKfidList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/open_kfid',
		body,
	);

	return responseData;
}
