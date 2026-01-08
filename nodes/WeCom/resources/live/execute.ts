import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

function buildActivityDetail(additionalFields: IDataObject): IDataObject | undefined {
	const detail: IDataObject = {};

	if (additionalFields.activity_detail_description) {
		detail.description = additionalFields.activity_detail_description as string;
	}

	if (additionalFields.activity_detail_image_list) {
		const images = (additionalFields.activity_detail_image_list as string)
			.split(',')
			.map((url) => url.trim())
			.filter((url) => url);

		if (images.length > 0) {
			detail.image_list = images;
		}
	}

	return Object.keys(detail).length > 0 ? detail : undefined;
}

export async function executeLive(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

			if (operation === 'createLiving') {
				const anchor_userid = this.getNodeParameter('anchor_userid', i) as string;
				const theme = this.getNodeParameter('theme', i) as string;
				const living_start = this.getNodeParameter('living_start', i) as number;
				const living_duration = this.getNodeParameter('living_duration', i) as number;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

				const body: IDataObject = {
					anchor_userid,
					theme,
					living_start,
					living_duration,
				};

				if (additionalFields.description) body.description = additionalFields.description;
				if (additionalFields.type !== undefined) body.type = additionalFields.type;
				if (additionalFields.agentid !== undefined && additionalFields.agentid !== 0) {
					body.agentid = additionalFields.agentid;
				}
				if (additionalFields.remind_time !== undefined) body.remind_time = additionalFields.remind_time;
				if (additionalFields.activity_cover_mediaid) {
					body.activity_cover_mediaid = additionalFields.activity_cover_mediaid;
				}
				if (additionalFields.activity_share_mediaid) {
					body.activity_share_mediaid = additionalFields.activity_share_mediaid;
				}

				const activityDetail = buildActivityDetail(additionalFields);
				if (activityDetail) body.activity_detail = activityDetail;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/create', body);
			} else if (operation === 'modifyLiving') {
				const livingid = this.getNodeParameter('livingid', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

				const body: IDataObject = { livingid };

				if (additionalFields.theme) body.theme = additionalFields.theme;
				if (additionalFields.living_start !== undefined && additionalFields.living_start !== 0) {
					body.living_start = additionalFields.living_start;
				}
				if (additionalFields.living_duration !== undefined && additionalFields.living_duration !== 0) {
					body.living_duration = additionalFields.living_duration;
				}
				if (additionalFields.description) body.description = additionalFields.description;
				if (additionalFields.type !== undefined) body.type = additionalFields.type;
				if (additionalFields.remind_time !== undefined) body.remind_time = additionalFields.remind_time;
				if (additionalFields.activity_cover_mediaid) {
					body.activity_cover_mediaid = additionalFields.activity_cover_mediaid;
				}
				if (additionalFields.activity_share_mediaid) {
					body.activity_share_mediaid = additionalFields.activity_share_mediaid;
				}

				const activityDetail = buildActivityDetail(additionalFields);
				if (activityDetail) body.activity_detail = activityDetail;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/modify', body);
			} else if (operation === 'cancelLiving') {
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/cancel', { livingid });
			} else if (operation === 'deleteLivingReplayData') {
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/delete_replay_data',
					{ livingid },
				);
			} else if (operation === 'getLivingShareInfo') {
				const livingid = this.getNodeParameter('livingid', i) as string;
				const wwshare = this.getNodeParameter('wwshare', i) as number;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/get_living_share_info',
					{ livingid, wwshare },
				);
			} else if (operation === 'getUserAllLivingId') {
				const userid = this.getNodeParameter('userid', i) as string;
				const additionalFields = this.getNodeParameter('additionalFields', i, {}) as IDataObject;

				const body: IDataObject = { userid };
				if (additionalFields.cursor) body.cursor = additionalFields.cursor;
				if (additionalFields.limit !== undefined) body.limit = additionalFields.limit;

				response = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/living/get_user_all_livingid',
					body,
				);
			} else if (operation === 'getLivingInfo') {
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(this, 'GET', '/cgi-bin/living/get_living_info', {}, {
					livingid,
				});
			} else if (operation === 'getLivingWatchStat') {
				const livingid = this.getNodeParameter('livingid', i) as string;
				const next_key = this.getNodeParameter('next_key', i, '') as string;

				const body: IDataObject = { livingid };
				if (next_key) body.next_key = next_key;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/get_watch_stat', body);
			} else if (operation === 'getLivingCode') {
				const openid = this.getNodeParameter('openid', i) as string;
				const livingid = this.getNodeParameter('livingid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/living/get_living_code', {
					openid,
					livingid,
				});
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
						error: (error as Error).message,
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
