import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function submitBatchAddVipJob(this: IExecuteFunctions): Promise<IDataObject> {
	const useridList = this.getNodeParameter('userid_list', 0) as string[];

	const body = {
		userid_list: useridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/vip/submit_batch_add_job',
		body,
	);

	return responseData;
}
