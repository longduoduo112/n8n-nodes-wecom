import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function useridToOpenuserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const useridList = this.getNodeParameter('useridList', index) as string[];

	const body: IDataObject = {
		userid_list: useridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/batch/userid_to_openuserid',
		body,
	);

	return responseData;
}
