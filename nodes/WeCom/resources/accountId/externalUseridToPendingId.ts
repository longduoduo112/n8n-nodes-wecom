import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function externalUseridToPendingId(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const externalUserid = this.getNodeParameter('externalUserid', index) as string[];
	const chatId = this.getNodeParameter('chatId', index, '') as string;

	const body: IDataObject = {
		external_userid: externalUserid,
	};

	if (chatId) {
		body.chat_id = chatId;
	}

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/idconvert/batch/external_userid_to_pending_id',
		body,
	);

	return responseData;
}
