import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

export async function executeLinkedcorp(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			const credentials = await this.getCredentials('weComApi');
			const defaultAgentId = credentials.agentId as string;

			let response: IDataObject;

			if (operation === 'getAppShareInfo') {
				const agentid = this.getNodeParameter('agentid', i, defaultAgentId) as string;
				const corpid = this.getNodeParameter('corpid', i, '') as string;

				const body: IDataObject = { agentid };
				if (corpid) body.corpid = corpid;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/linkedcorp/agent/get_perm_list', body);
			} else if (operation === 'getLinkedCorpToken') {
				const business_type = this.getNodeParameter('business_type', i) as string;
				const corpid = this.getNodeParameter('corpid', i) as string;
				const agentid = this.getNodeParameter('agentid', i, defaultAgentId) as string;

				const body: IDataObject = {
					business_type,
					corpid,
					agentid,
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/linkedcorp/access_token', body);
			} else if (operation === 'getMiniProgramSession') {
				const code = this.getNodeParameter('code', i) as string;
				const business_type = this.getNodeParameter('business_type', i) as string;
				const corpid = this.getNodeParameter('corpid', i) as string;
				const agentid = this.getNodeParameter('agentid', i, defaultAgentId) as string;

				const body: IDataObject = {
					code,
					business_type,
					corpid,
					agentid,
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/miniprogram/jscode2session', body);
			} else if (operation === 'getLinkedCustomer') {
				const customer_type = this.getNodeParameter('customer_type', i) as string;
				const external_userid = this.getNodeParameter('external_userid', i) as string;
				const corpid = this.getNodeParameter('corpid', i, '') as string;

				const body: IDataObject = { external_userid };
				if (corpid) body.corpid = corpid;

				const endpoint = customer_type === 'added'
					? '/cgi-bin/externalcontact/get_new_external_userid'
					: '/cgi-bin/externalcontact/unionid_to_external_userid';

				response = await weComApiRequest.call(this, 'POST', endpoint, body);
			} else if (operation === 'getChainInfo') {
				const chain_id = this.getNodeParameter('chain_id', i, '') as string;

				const qs: IDataObject = {};
				if (chain_id) qs.chain_id = chain_id;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/get_chain_group_list', qs);
			} else if (operation === 'batchImportChainContact') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const media_ID = this.getNodeParameter('media_ID', i) as string;

				const body: IDataObject = {
					chain_id,
					media_ID,
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/import_chain_contact', body);
			} else if (operation === 'getChainAsyncResult') {
				const jobid = this.getNodeParameter('jobid', i) as string;

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/externalcontact/get_group_chain_result', {}, { jobid });
			} else if (operation === 'removeChainCorp') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const corpid = this.getNodeParameter('corpid', i) as string;

				const body: IDataObject = {
					chain_id,
					corpid,
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/del_corp_in_chain', body);
			} else if (operation === 'getCustomUserId') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				const body: IDataObject = {
					chain_id,
					userid_list: userid_list.split(',').map((id) => id.trim()),
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/get_custom_userid', body);
			} else if (operation === 'getSubCorpChainList') {
				const corpid = this.getNodeParameter('corpid', i) as string;

				const body: IDataObject = { corpid };

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/get_subcorp_chain_list', body);
			} else if (operation === 'getChainRuleList') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;

				const body: IDataObject = { chain_id };

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/customer/get_rule_list', body);
			} else if (operation === 'deleteChainRule') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_id = this.getNodeParameter('rule_id', i) as string;

				const body: IDataObject = {
					chain_id,
					rule_id,
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/customer/del_rule', body);
			} else if (operation === 'getChainRuleDetail') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_id = this.getNodeParameter('rule_id', i) as string;

				const body: IDataObject = {
					chain_id,
					rule_id,
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/customer/get_rule_detail', body);
			} else if (operation === 'addChainRule') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_name = this.getNodeParameter('rule_name', i) as string;
				const match_type = this.getNodeParameter('match_type', i) as number;
				const rangeCollection = this.getNodeParameter('rangeCollection', i, {}) as IDataObject;

				// 构建range数组
				const range: IDataObject[] = [];
				if (rangeCollection.ranges) {
					const rangesList = rangeCollection.ranges as IDataObject[];
					rangesList.forEach((r) => {
						const rangeItem: IDataObject = { type: r.type };
						if (r.type === 1 && r.userid) {
							rangeItem.userid = r.userid;
						} else if (r.type === 2 && r.partyid) {
							rangeItem.partyid = r.partyid;
						}
						range.push(rangeItem);
					});
				}

				const body: IDataObject = {
					chain_id,
					rule_name,
					rule_config: {
						match_type,
						range,
					},
				};

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/customer/add_rule', body);
			} else if (operation === 'updateChainRule') {
				const chain_id = this.getNodeParameter('chain_id', i) as string;
				const rule_id = this.getNodeParameter('rule_id', i) as string;
				const rule_name = this.getNodeParameter('rule_name', i, '') as string;
				const updateConfig = this.getNodeParameter('updateConfig', i, false) as boolean;

				const body: IDataObject = {
					chain_id,
					rule_id,
				};

				if (rule_name) body.rule_name = rule_name;

				if (updateConfig) {
					const match_type = this.getNodeParameter('match_type', i) as number;
					const rangeCollection = this.getNodeParameter('rangeCollection', i, {}) as IDataObject;

					// 构建range数组
					const range: IDataObject[] = [];
					if (rangeCollection.ranges) {
						const rangesList = rangeCollection.ranges as IDataObject[];
						rangesList.forEach((r) => {
							const rangeItem: IDataObject = { type: r.type };
							if (r.type === 1 && r.userid) {
								rangeItem.userid = r.userid;
							} else if (r.type === 2 && r.partyid) {
								rangeItem.partyid = r.partyid;
							}
							range.push(rangeItem);
						});
					}

					body.rule_config = {
						match_type,
						range,
					};
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/externalcontact/customer/update_rule', body);
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
