import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessTokenInfo as getSystemAccessTokenInfo } from '../../shared/transport';

/**
 * 获取企业微信 Access Token
 *
 * 用途：
 * - 供下游节点使用
 * - 调试鉴权问题
 *
 * @returns 包含 access_token 和过期信息的对象
 */
export async function getAccessToken(this: IExecuteFunctions): Promise<IDataObject> {
	const tokenInfo = await getSystemAccessTokenInfo.call(this);

	return {
		access_token: tokenInfo.access_token,
		expires_at: tokenInfo.expires_at,
		expires_in: tokenInfo.expires_in,
		last_access: tokenInfo.last_access,
	};
}
