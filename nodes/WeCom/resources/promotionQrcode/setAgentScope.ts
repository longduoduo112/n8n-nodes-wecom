import type { IExecuteFunctions, IDataObject, IHttpRequestOptions } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

/**
 * 设置授权应用可见范围
 * 官方文档：https://developer.work.weixin.qq.com/document/path/90583
 *
 * 用途：
 * - 设置授权应用的可见范围（成员、部门、标签）
 *
 * 注意事项：
 * - 调用该接口前提是开启通讯录迁移，收到授权成功通知后可调用
 * - 企业注册初始化安装应用后，应用默认可见范围为根部门
 * - 该接口只能使用注册完成回调事件或者查询注册状态返回的access_token
 * - 调用设置通讯录同步完成后或者access_token超过30分钟失效（即解除通讯录锁定状态）则不能继续调用该接口
 * - 若未填某个字段，则清空可见范围中对应的列表
 *
 * @returns 设置结果（包含无效的成员、部门、标签列表）
 */
export async function setAgentScope(
	this: IExecuteFunctions,
	index: number,
): Promise<IDataObject> {
	const accessToken = this.getNodeParameter('accessToken', index) as string;
	const agentid = this.getNodeParameter('agentid', index) as number;
	const allowUser = this.getNodeParameter('allowUser', index) as string | undefined;
	const allowParty = this.getNodeParameter('allowParty', index) as string | undefined;
	const allowTag = this.getNodeParameter('allowTag', index) as string | undefined;

	if (!accessToken) {
		throw new NodeOperationError(
			this.getNode(),
			'Access Token不能为空',
			{ itemIndex: index },
		);
	}

	if (!agentid) {
		throw new NodeOperationError(
			this.getNode(),
			'授权方应用id不能为空',
			{ itemIndex: index },
		);
	}

	const body: IDataObject = {
		agentid,
	};

	if (allowUser) {
		body.allow_user = allowUser.split(',').map((id) => id.trim()).filter((id) => id.length > 0);
	}

	if (allowParty) {
		body.allow_party = allowParty.split(',').map((id) => {
			const numId = parseInt(id.trim(), 10);
			return isNaN(numId) ? null : numId;
		}).filter((id) => id !== null) as number[];
	}

	if (allowTag) {
		body.allow_tag = allowTag.split(',').map((id) => {
			const numId = parseInt(id.trim(), 10);
			return isNaN(numId) ? null : numId;
		}).filter((id) => id !== null) as number[];
	}

	const options: IHttpRequestOptions = {
		method: 'POST',
		url: 'https://qyapi.weixin.qq.com/cgi-bin/agent/set_scope',
		qs: {
			access_token: accessToken,
		},
		body,
		json: true,
	};

	try {
		const response = (await this.helpers.httpRequest(options)) as IDataObject;

		if (response.errcode !== undefined && response.errcode !== 0) {
			throw new NodeOperationError(
				this.getNode(),
				`设置授权应用可见范围失败: ${response.errmsg} (错误码: ${response.errcode})`,
				{ itemIndex: index },
			);
		}

		return response;
	} catch (error) {
		const err = error as Error;
		throw new NodeOperationError(
			this.getNode(),
			`设置授权应用可见范围失败: ${err.message}`,
			{ itemIndex: index },
		);
	}
}
