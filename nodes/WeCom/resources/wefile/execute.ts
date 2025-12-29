import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { weComApiRequest } from '../../shared/transport';

// 辅助函数：构建成员信息
function buildAuthInfo(members: IDataObject[]): IDataObject[] {
	return members.map((member) => {
		const info: IDataObject = { type: member.type };
		if (member.type === 1) {
			info.userid = member.userid;
		} else if (member.type === 2) {
			info.departmentid = member.departmentid;
		}
		if (member.auth !== undefined) {
			info.auth = member.auth;
		}
		return info;
	});
}

export async function executeWefile(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let responseData;

			// 空间管理操作
			if (operation === 'createSpace') {
				const spaceName = this.getNodeParameter('spaceName', i) as string;
				const authInfo = this.getNodeParameter('authInfo', i, {}) as IDataObject;

				const body: IDataObject = { space_name: spaceName };

				// 处理权限信息
				if (authInfo.auth) {
					const auth = authInfo.auth as IDataObject;
					const authData: IDataObject = {};
					if (auth.userid) {
						authData.userid = (auth.userid as string).split(',').map((id) => id.trim()).filter((id) => id);
					}
					if (auth.departmentid) {
						authData.departmentid = (auth.departmentid as string).split(',').map((id) => parseInt(id.trim(), 10)).filter((id) => !isNaN(id));
					}
					if (auth.auth !== undefined) {
						authData.auth = auth.auth;
					}
					body.auth_info = authData;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_create',
					body,
				);
			} else if (operation === 'renameSpace') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const spaceName = this.getNodeParameter('spaceName', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_rename',
					{ spaceid: spaceId, space_name: spaceName },
				);
			} else if (operation === 'deleteSpace') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_dismiss',
					{ spaceid: spaceId },
				);
			} else if (operation === 'getSpaceInfo') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_info',
					{ spaceid: spaceId },
				);
			}
			// 空间权限管理
			else if (operation === 'addSpaceMembers') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { spaceid: spaceId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_add',
					body,
				);
			} else if (operation === 'removeSpaceMembers') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { spaceid: spaceId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_acl_del',
					body,
				);
			} else if (operation === 'spaceSecuritySettings') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const enableWatermark = this.getNodeParameter('enableWatermark', i, false) as boolean;
				const addMemberOnlyAdmin = this.getNodeParameter('addMemberOnlyAdmin', i, false) as boolean;
				const enableShareUrl = this.getNodeParameter('enableShareUrl', i, true) as boolean;
				const shareUrlNoApprove = this.getNodeParameter('shareUrlNoApprove', i, false) as boolean;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_setting',
					{
						spaceid: spaceId,
						enable_watermark: enableWatermark,
						add_member_only_admin: addMemberOnlyAdmin,
						enable_share_url: enableShareUrl,
						share_url_no_approve: shareUrlNoApprove,
					},
				);
			} else if (operation === 'getSpaceInviteLink') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/space_share',
					{ spaceid: spaceId },
				);
			}
			// 文件管理操作
			else if (operation === 'getFileList') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const sortType = this.getNodeParameter('sortType', i, 0) as number;
				const start = this.getNodeParameter('start', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 50) as number;

				const body: IDataObject = {
					spaceid: spaceId,
					sort_type: sortType,
					start,
					limit,
				};

				if (fatherId) {
					body.fatherid = fatherId;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_list',
					body,
				);
			} else if (operation === 'uploadFile') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;
				const fileName = this.getNodeParameter('fileName', i) as string;
				const binaryPropertyName = this.getNodeParameter('binaryPropertyName', i) as string;

				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const formData = {
					spaceid: spaceId,
					fatherid: fatherId || '',
					file_name: fileName,
					file: {
						value: dataBuffer,
						options: {
							filename: fileName,
							contentType: 'application/octet-stream',
						},
					},
				};

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_upload',
					formData,
					{},
					{ multipart: true },
				);
			} else if (operation === 'downloadFile') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_download',
					{ fileid: fileId },
				);
			} else if (operation === 'createFolder') {
				const spaceId = this.getNodeParameter('spaceId', i) as string;
				const folderName = this.getNodeParameter('folderName', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i, '') as string;

				const body: IDataObject = {
					spaceid: spaceId,
					file_name: folderName,
				};

				if (fatherId) {
					body.fatherid = fatherId;
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_create',
					body,
				);
			} else if (operation === 'renameFile') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const newName = this.getNodeParameter('newName', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_rename',
					{ fileid: fileId, new_name: newName },
				);
			} else if (operation === 'moveFile') {
				const fileIdsStr = this.getNodeParameter('fileIds', i) as string;
				const fatherId = this.getNodeParameter('fatherId', i) as string;
				const replace = this.getNodeParameter('replace', i, false) as boolean;

				const fileIds = fileIdsStr.split(',').map((id) => id.trim()).filter((id) => id);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_move',
					{ fileid: fileIds, fatherid: fatherId, replace },
				);
			} else if (operation === 'deleteFile') {
				const fileIdsStr = this.getNodeParameter('fileIds', i) as string;

				const fileIds = fileIdsStr.split(',').map((id) => id.trim()).filter((id) => id);

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_delete',
					{ fileid: fileIds },
				);
			} else if (operation === 'getFileInfo') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_info',
					{ fileid: fileId },
				);
			}
			// 文件权限管理
			else if (operation === 'addFileMembers') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { fileid: fileId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_add',
					body,
				);
			} else if (operation === 'removeFileMembers') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const authInfoCollection = this.getNodeParameter('authInfoCollection', i, {}) as IDataObject;

				const body: IDataObject = { fileid: fileId };

				if (authInfoCollection.members && Array.isArray(authInfoCollection.members)) {
					body.auth_info = buildAuthInfo(authInfoCollection.members as IDataObject[]);
				}

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_del',
					body,
				);
			} else if (operation === 'fileShareSettings') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const shareScope = this.getNodeParameter('shareScope', i) as number;
				const authScope = this.getNodeParameter('authScope', i) as number;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_setting',
					{ fileid: fileId, share_scope: shareScope, auth_scope: authScope },
				);
			} else if (operation === 'getFileShareLink') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_share',
					{ fileid: fileId },
				);
			} else if (operation === 'getFilePermissions') {
				const fileId = this.getNodeParameter('fileId', i) as string;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_acl_list',
					{ fileid: fileId },
				);
			} else if (operation === 'fileSecuritySettings') {
				const fileId = this.getNodeParameter('fileId', i) as string;
				const enableWatermark = this.getNodeParameter('enableWatermark', i, false) as boolean;
				const addMemberOnlyAdmin = this.getNodeParameter('addMemberOnlyAdmin', i, false) as boolean;
				const enableShareUrl = this.getNodeParameter('enableShareUrl', i, true) as boolean;
				const shareUrlNoApprove = this.getNodeParameter('shareUrlNoApprove', i, false) as boolean;

				responseData = await weComApiRequest.call(
					this,
					'POST',
					'/cgi-bin/wedrive/file_secure_setting',
					{
						fileid: fileId,
						enable_watermark: enableWatermark,
						add_member_only_admin: addMemberOnlyAdmin,
						enable_share_url: enableShareUrl,
						share_url_no_approve: shareUrlNoApprove,
					},
				);
			}

			if (responseData) {
				returnData.push({
					json: responseData,
					pairedItem: i,
				});
			}
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: (error as Error).message },
					pairedItem: i,
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
