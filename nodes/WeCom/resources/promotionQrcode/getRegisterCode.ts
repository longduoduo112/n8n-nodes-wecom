import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { getWeComBaseUrl } from '../../shared/transport';

/**
 * 获取注册码
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90581
 *
 * 用途：
 * - 根据注册推广包生成注册码（register_code）
 *
 * 注意事项：
 * - 需要provider_access_token
 * - register_code只能消费一次，在访问注册链接时消费
 * - register_code有效期由expires_in字段指定，生成链接需要在有效期内点击跳转
 *
 * @returns 注册码信息（包含register_code和expires_in）
 */
export async function getRegisterCode(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const templateId = this.getNodeParameter('templateId', index) as string;
	const corpName = this.getNodeParameter('corpName', index) as string | undefined;
	const adminName = this.getNodeParameter('adminName', index) as string | undefined;
	const adminMobile = this.getNodeParameter('adminMobile', index) as string | undefined;
	const state = this.getNodeParameter('state', index) as string | undefined;
	const followUser = this.getNodeParameter('followUser', index) as string | undefined;

	if (!providerAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Provider Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!templateId) {
		throw new NodeOperationError(
			this.getNode(),
			'推广包ID不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		template_id: templateId,
	};

	if (corpName) {
		body.corp_name = corpName;
	}

	if (adminName) {
		body.admin_name = adminName;
	}

	if (adminMobile) {
		body.admin_mobile = adminMobile;
	}

	if (state) {
		body.state = state;
	}

	if (followUser) {
		body.follow_user = followUser;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: `${await getWeComBaseUrl.call(this)}/cgi-bin/service/get_register_code`,
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
				`获取注册码失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取注册码失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}