import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function getNewExternalUseridGroupchat(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const chatId = this.getNodeParameter('chatId', index) as string;
	const externalUseridList = this.getNodeParameter('externalUseridList', index) as string[];

	const body: IDataObject = {
		chat_id: chatId,
		external_userid_list: externalUseridList,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/externalcontact/groupchat/get_new_external_userid',
		body,
	);

	return responseData;
}
