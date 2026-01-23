import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function batchDelVipJobResult(this: IExecuteFunctions): Promise<IDataObject> {
	const jobid = this.getNodeParameter('jobid', 0) as string;

	const body = {
		jobid: jobid,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/vip/batch_del_job_result',
		body,
	);

	return responseData;
}
