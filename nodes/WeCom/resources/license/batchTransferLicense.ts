import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 账号继承
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95673
 *
 * 用途：
 * - 在企业员工离职或者工作范围的有变更时，允许将其许可账号继承给其他员工
 *
 * 注意事项：
 * - 转移成员和接收成员属于同一个企业
 * - 转移成员的账号已激活，且在有效期
 * - 转移许可的成员为离职成员，或不在服务商应用的可见范围内时，不限制下次转移的时间间隔
 * - 转移许可的成员为在职成员且在服务商应用的可见范围内时，转移后30天后才可进行下次转移
 * - 当接收成员许可与转移成员的许可重叠时（同时拥有基础账号或者互通账号），如果接收成员许可剩余时长小于等于20天则可以成功继承，否则会报错
 * - 单次转移的账号数限制在1000以内
 *
 * @returns 继承结果（包含继承结果列表）
 */
export async function batchTransferLicense(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const transferListCollection = this.getNodeParameter('transferListCollection', index, {}) as IDataObject;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!corpid || corpid.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'企业ID不能为空',
			{ itemIndex: index },
		);
	}

	const transferList: IDataObject[] = [];
	if (transferListCollection.transfers) {
		const transfers = transferListCollection.transfers as IDataObject[];
		if (transfers.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'继承信息列表不能为空',
				{ itemIndex: index },
			);
		}
		if (transfers.length > 1000) {
			throw new NodeOperationError(
				this.getNode(),
				'单次转移的账号数限制在1000以内',
				{ itemIndex: index },
			);
		}
		transfers.forEach((transfer) => {
			if (!transfer.handoverUserid || (transfer.handoverUserid as string).trim() === '') {
				throw new NodeOperationError(
					this.getNode(),
					'转移成员的userid不能为空',
					{ itemIndex: index },
				);
			}
			if (!transfer.takeoverUserid || (transfer.takeoverUserid as string).trim() === '') {
				throw new NodeOperationError(
					this.getNode(),
					'接收成员的userid不能为空',
					{ itemIndex: index },
				);
			}
			transferList.push({
				handover_userid: transfer.handoverUserid,
				takeover_userid: transfer.takeoverUserid,
			});
		});
	} else {
		throw new NodeOperationError(
			this.getNode(),
			'继承信息列表不能为空',
			{ itemIndex: index },
		);
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/batch_transfer_license',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body: {
			corpid,
			transfer_list: transferList,
		},
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`账号继承失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`账号继承失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
