export interface IWeComCredentials {
	corpId: string;
	corpSecret: string;
	agentId: string;
	baseUrl?: string;
}

export interface IWeComAccessTokenResponse {
	errcode: number;
	errmsg: string;
	access_token?: string;
	expires_in?: number;
}
