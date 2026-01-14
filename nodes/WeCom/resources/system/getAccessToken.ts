import type { IExecuteFunctions, IDataObject } from 'n8n-workflow';
import { getAccessToken as getSystemAccessToken } from '../../shared/transport';

/**
 * 获取企业微信 Access Token
 * 
 * 用途：
 * - 供下游节点使用
 * - 调试鉴权问题
 *
 * @returns 包含 access_token 的对象
 */
export async function getAccessToken(this: IExecuteFunctions): Promise<IDataObject> {
	const token = await getSystemAccessToken.call(this);
	
	return {
		access_token: token,
	};
}
