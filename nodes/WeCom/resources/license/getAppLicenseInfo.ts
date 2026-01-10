import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 获取应用的接口许可状态
 * 官方文档：https://developer.work.weixin.qq.com/document/path/95844
 *
 * 用途：
 * - 服务商可获取某个授权企业的应用接口许可试用期
 * - 免费试用期为企业首次安装应用后的90天
 *
 * 注意事项：
 * - 企业必须已安装了该第三方应用或者代开发应用才允许调用
 * - license_status：0：未开启license检查状态，1：已开启license检查状态
 * - 若开启且已过试用期，则需要为企业购买license账号才可以使用
 * - 服务商测试企业、历史迁移应用无试用期
 * - appid：旧的多应用套件中的应用id，新开发者请忽略
 *
 * @returns 应用的接口许可状态信息（包含license状态、试用期信息等）
 */
export async function getAppLicenseInfo(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const providerAccessToken = this.getNodeParameter('providerAccessToken', index) as string;
	const corpid = this.getNodeParameter('corpid', index) as string;
	const suiteId = this.getNodeParameter('suiteId', index) as string;
	const appid = this.getNodeParameter('appid', index) as number | undefined;

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

	if (!suiteId || suiteId.trim() === '') {
		throw new NodeOperationError(
			this.getNode(),
			'套件ID不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		corpid,
		suite_id: suiteId,
	};

	if (appid !== undefined && appid > 0) {
		body.appid = appid;
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/license/get_app_license_info',
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
				`获取应用的接口许可状态失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`获取应用的接口许可状态失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
