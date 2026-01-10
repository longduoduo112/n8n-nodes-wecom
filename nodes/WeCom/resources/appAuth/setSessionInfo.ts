import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 设置授权配置
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90602
 *
 * 用途：
 * - 对某次授权进行配置
 * - 可支持测试模式（应用未发布时）
 *
 * 注意事项：
 * - 需要先通过"获取第三方应用凭证"接口获取suite_access_token
 * - 需要先通过"获取预授权码"接口获取pre_auth_code
 * - 授权类型：0 正式授权，1 测试授权。默认值为0
 * - 请确保应用在正式发布后的授权类型为"正式授权"
 *
 * @returns 设置结果
 */
export async function setSessionInfo(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const suiteAccessToken = this.getNodeParameter('suiteAccessToken', index) as string;
	const preAuthCode = this.getNodeParameter('preAuthCode', index) as string;
	const appidStr = this.getNodeParameter('appid', index, '') as string;
	const authType = this.getNodeParameter('authType', index, 0) as number;

	if (!suiteAccessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Suite Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!preAuthCode) {
		throw new NodeOperationError(
			this.getNode(),
			'预授权码不能为空',
			{ itemIndex: index },
		);
	}

	// 构建请求体
	const body: IDataObject = {
		pre_auth_code: preAuthCode,
		session_info: {} as IDataObject,
	};

	// 处理 appid 数组
	if (appidStr && appidStr.trim()) {
		const appidArray = appidStr
			.split(',')
			.map((id) => parseInt(id.trim(), 10))
			.filter((id) => !isNaN(id));
		if (appidArray.length > 0) {
			(body.session_info as IDataObject).appid = appidArray;
		}
	}

	// 设置授权类型
	(body.session_info as IDataObject).auth_type = authType;

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/service/set_session_info',
		qs: {
			suite_access_token: suiteAccessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		// 检查 API 错误
		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`设置授权配置失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`设置授权配置失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
