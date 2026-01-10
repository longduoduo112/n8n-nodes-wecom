import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function unionidToExternalUserid(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const unionid = this.getNodeParameter('unionid', index) as string;
	const openid = this.getNodeParameter('openid', index) as string;
	const subjectType = this.getNodeParameter('subjectType', index, 0) as number;

	const body: IDataObject = {
		unionid,
		openid,
		subject_type: subjectType,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/unionid_to_external_userid',
		body,
	);

	return responseData;
}
