import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 创建续期任务
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95646
 *
 * 用途：
 * - 可以下单为一批已激活账号的成员续期
 * - 续期下单分为两个步骤：创建续期任务和提交续期订单
 * - 在同一个订单里，首次创建任务无须指定jobid，后续指定同一个jobid，表示往同一个订单任务追加续期的成员
 *
 * 注意事项：
 * - 每次最多1000个账号
 * - 同一个jobid最多关联1000000个基础账号跟1000000个互通账号
 * - 续期账号类型：1:基础账号，2:互通账号
 *
 * @returns 任务信息（包含jobid和不合法的账号列表）
 */
export async function createRenewOrderJob(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const accountCollection = this.getNodeParameter('accountCollection', index, {}) as IDataObject;
	const jobid = this.getNodeParameter('jobid', index) as string | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!corpid) {
		throw new NodeOperationError(
			this.getNode(),
			'企业ID不能为空',
			{ itemIndex: index },
		);
	}

	const accountList: IDataObject[] = [];
	if (accountCollection.accounts) {
		const accounts = accountCollection.accounts as IDataObject[];
		if (accounts.length === 0) {
			throw new NodeOperationError(
				this.getNode(),
				'续期账号列表不能为空',
				{ itemIndex: index },
			);
		}
		if (accounts.length > 1000) {
			throw new NodeOperationError(
				this.getNode(),
				'每次最多1000个账号',
				{ itemIndex: index },
			);
		}
		accounts.forEach((account) => {
			if (!account.userid) {
				throw new NodeOperationError(
					this.getNode(),
					'账号列表中的userid不能为空',
					{ itemIndex: index },
				);
			}
			if (!account.type || (account.type !== 1 && account.type !== 2)) {
				throw new NodeOperationError(
					this.getNode(),
					'账号类型必须为1（基础账号）或2（互通账号）',
					{ itemIndex: index },
				);
			}
			accountList.push({
				userid: account.userid,
				type: account.type,
			});
		});
	} else {
		throw new NodeOperationError(
			this.getNode(),
			'续期账号列表不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		corpid,
		account_list: accountList,
	};

	if (jobid) {
		body.jobid = jobid;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/create_renew_order_job',
		qs: {
			provider_access_token: providerAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`创建续期任务失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`创建续期任务失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
