import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest, getAccessToken } from '../../shared/transport';

// 辅助函数：构建单元格值
function buildCellValue(valueType: string, value: string): IDataObject {
	switch (valueType) {
		case 'number':
			return { number: parseFloat(value) || 0 };
		case 'url':
			return { url: { link: value, text: value } };
		case 'email':
			return { email: value };
		case 'checkbox':
			return { checkbox: value.toLowerCase() === 'true' || value === '1' };
		default:
			return { text: value };
	}
}

// 辅助函数：构建成员信息
function buildMemberInfo(member: IDataObject): IDataObject {
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
}

export async function executeWedoc(
	this: IExecuteFunctions,
	operation: string,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];

	for (let i = 0; i < items.length; i++) {
		try {
			let response: IDataObject;

		// 管理文档
		if (operation === 'createDoc') {
			const doc_type = this.getNodeParameter('doctype', i) as number;
			const doc_name = this.getNodeParameter('doc_name', i) as string;
			const admin_users = this.getNodeParameter('admin_users', i, '') as string;
			const useSpaceId = this.getNodeParameter('useSpaceId', i, false) as boolean;

			const body: IDataObject = { doc_type, doc_name };
			if (admin_users) {
				body.admin_users = admin_users.split(',').map((id) => id.trim());
			}

			if (useSpaceId) {
				const spaceid = this.getNodeParameter('spaceid', i) as string;
				const fatherid = this.getNodeParameter('fatherid', i) as string;
				body.spaceid = spaceid;
				body.fatherid = fatherid;
			}

			response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_doc', body);
			} else if (operation === 'renameDoc') {
				const docid = this.getNodeParameter('docid', i) as string;
				const new_name = this.getNodeParameter('new_name', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/rename_doc', {
					docid,
					new_name,
				});
			} else if (operation === 'deleteDoc') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/del_doc', { docid });
			} else if (operation === 'getDocInfo') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_get_info', { docid });
			}
			// 分享文档
			else if (operation === 'shareDoc') {
				const docType = this.getNodeParameter('docType', i, 'docid') as string;
				const request: IDataObject = {};

				if (docType === 'formid') {
					request.formid = this.getNodeParameter('formid', i) as string;
				} else {
					request.docid = this.getNodeParameter('docid', i) as string;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_share', request);
			}
			// 编辑文档
			else if (operation === 'modDocContent') {
				const docid = this.getNodeParameter('docid', i) as string;
				const requestsCollection = this.getNodeParameter('requestsCollection', i, {}) as IDataObject;

				const requests: IDataObject[] = [];

				if (requestsCollection.requests && Array.isArray(requestsCollection.requests)) {
					for (const req of requestsCollection.requests as IDataObject[]) {
						const request: IDataObject = {};

						if (req.request_type === 'insert_text') {
							request.insert_text = {
								text: req.text || '',
								location: { index: req.location_index || 1 },
							};
						} else if (req.request_type === 'insert_paragraph') {
							request.insert_paragraph = {
								location: { index: req.location_index || 1 },
							};
						} else if (req.request_type === 'delete_content') {
							request.delete_content = {
								range: {
									start_index: req.delete_start || 1,
									end_index: req.delete_end || 1,
								},
							};
						} else if (req.request_type === 'replace_text') {
							request.replace_all_text = {
								contains_text: { text: req.search_text || '' },
								replace_text: req.replace_text || '',
								match_case: false,
							};
						}

						if (Object.keys(request).length > 0) {
							requests.push(request);
						}
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc', {
					docid,
					requests,
				});
			} else if (operation === 'modSheetContent') {
				const docid = this.getNodeParameter('docid', i) as string;
				const requestsCollection = this.getNodeParameter('requestsCollection', i, {}) as IDataObject;

				const requests: IDataObject[] = [];

				if (requestsCollection.requests && Array.isArray(requestsCollection.requests)) {
					for (const req of requestsCollection.requests as IDataObject[]) {
						const request: IDataObject = {};
						const sheetName = (req.sheet_name as string) || 'Sheet1';

						if (req.request_type === 'update_range') {
							const valuesStr = (req.values as string) || '';
							const rows = valuesStr.split(';').map((row) =>
								row.split(',').map((cell) => cell.trim())
							);
							request.update_range = {
								range: `${sheetName}!${req.range || 'A1'}`,
								values: rows,
							};
						} else if (req.request_type === 'append_rows') {
							const valuesStr = (req.values as string) || '';
							const rows = valuesStr.split(';').map((row) =>
								row.split(',').map((cell) => cell.trim())
							);
							request.append_rows = {
								sheet_name: sheetName,
								values: rows,
							};
						} else if (req.request_type === 'insert_rows') {
							request.insert_rows = {
								sheet_name: sheetName,
								start_row: req.row_index || 1,
								number: req.row_count || 1,
							};
						} else if (req.request_type === 'delete_rows') {
							request.delete_rows = {
								sheet_name: sheetName,
								start_row: req.row_index || 1,
								number: req.row_count || 1,
							};
						} else if (req.request_type === 'insert_columns') {
							request.insert_columns = {
								sheet_name: sheetName,
								start_column: req.column_index || 1,
								number: req.column_count || 1,
							};
						} else if (req.request_type === 'delete_columns') {
							request.delete_columns = {
								sheet_name: sheetName,
								start_column: req.column_index || 1,
								number: req.column_count || 1,
							};
						}

						if (Object.keys(request).length > 0) {
							requests.push(request);
						}
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/spreadsheet/batch_update', {
					docid,
					requests,
				});
			}
			// 智能表格操作 - 子表
			else if (operation === 'addSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_title = this.getNodeParameter('sheet_title', i) as string;
				const sheet_index = this.getNodeParameter('sheet_index', i, 0) as number;

				const properties: IDataObject = { title: sheet_title };
				if (sheet_index > 0) {
					properties.index = sheet_index;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_sheet', {
					docid,
					properties,
				});
			} else if (operation === 'delSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_sheet', {
					docid,
					sheet_id,
				});
			} else if (operation === 'updateSmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const sheet_title = this.getNodeParameter('sheet_title', i, '') as string;

				const properties: IDataObject = {};
				if (sheet_title) {
					properties.title = sheet_title;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_sheet', {
					docid,
					sheet_id,
					properties,
				});
			}
			// 智能表格操作 - 视图
			else if (operation === 'addSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_title = this.getNodeParameter('view_title', i) as string;
				const view_type = this.getNodeParameter('view_type', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_view', {
					docid,
					sheet_id,
					view_title,
					view_type,
				});
			} else if (operation === 'delSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_view', {
					docid,
					sheet_id,
					view_id,
				});
			} else if (operation === 'updateSmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i) as string;
				const view_title = this.getNodeParameter('view_title', i, '') as string;

				const body: IDataObject = { docid, sheet_id, view_id };
				if (view_title) {
					body.view_title = view_title;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_view', body);
			}
			// 智能表格操作 - 字段
			else if (operation === 'addSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				const fields: IDataObject[] = [];
				if (fieldsCollection.fields && Array.isArray(fieldsCollection.fields)) {
					for (const field of fieldsCollection.fields as IDataObject[]) {
						const fieldDef: IDataObject = {
							field_title: field.field_title,
							field_type: field.field_type,
						};

						// 处理单选/多选的选项
						if (['FIELD_TYPE_SINGLE_SELECT', 'FIELD_TYPE_MULTI_SELECT'].includes(field.field_type as string) && field.select_options) {
							const options = (field.select_options as string).split(',').map((opt, idx) => ({
								id: `opt_${idx}`,
								text: opt.trim(),
							}));
							fieldDef.property_select = { options };
						}

						fields.push(fieldDef);
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_fields', {
					docid,
					sheet_id,
					fields,
				});
			} else if (operation === 'delSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const field_ids_str = this.getNodeParameter('field_ids', i) as string;

				const field_ids = field_ids_str.split(',').map((id) => id.trim()).filter((id) => id);
				if (field_ids.length === 0) {
					throw new NodeOperationError(this.getNode(), '至少需要提供一个字段ID', { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_fields', {
					docid,
					sheet_id,
					field_ids,
				});
			} else if (operation === 'updateSmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const fieldsCollection = this.getNodeParameter('fieldsCollection', i, {}) as IDataObject;

				const fields: IDataObject[] = [];
				if (fieldsCollection.fields && Array.isArray(fieldsCollection.fields)) {
					for (const field of fieldsCollection.fields as IDataObject[]) {
						const fieldDef: IDataObject = {
							field_id: field.field_id,
						};

						if (field.field_title) {
							fieldDef.field_title = field.field_title;
						}

						// 处理单选/多选的选项更新
						if (field.select_options) {
							const options = (field.select_options as string).split(',').map((opt, idx) => ({
								id: `opt_${idx}`,
								text: opt.trim(),
							}));
							fieldDef.property_select = { options };
						}

						fields.push(fieldDef);
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_fields', {
					docid,
					sheet_id,
					fields,
				});
			}
			// 智能表格操作 - 记录
			else if (operation === 'addSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const key_type = this.getNodeParameter('key_type', i, 'CELL_VALUE_KEY_TYPE_FIELD_TITLE') as string;
				const recordsCollection = this.getNodeParameter('recordsCollection', i, {}) as IDataObject;

				const records: IDataObject[] = [];
				if (recordsCollection.records && Array.isArray(recordsCollection.records)) {
					for (const record of recordsCollection.records as IDataObject[]) {
						const values: IDataObject = {};
						const cellValues = record.cellValues as IDataObject;

						if (cellValues?.values && Array.isArray(cellValues.values)) {
							for (const cv of cellValues.values as IDataObject[]) {
								const fieldKey = cv.field_key as string;
								const valueType = cv.value_type as string;
								const value = cv.value as string;
								values[fieldKey] = buildCellValue(valueType, value);
							}
						}

						records.push({ values });
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/add_records', {
					docid,
					sheet_id,
					key_type,
					records,
				});
			} else if (operation === 'delSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const record_ids = this.getNodeParameter('record_ids', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/delete_records', {
					docid,
					sheet_id,
					record_ids: record_ids.split(',').map((id) => id.trim()),
				});
			} else if (operation === 'updateSmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const key_type = this.getNodeParameter('key_type', i, 'CELL_VALUE_KEY_TYPE_FIELD_TITLE') as string;
				const recordsCollection = this.getNodeParameter('recordsCollection', i, {}) as IDataObject;

				const records: IDataObject[] = [];
				if (recordsCollection.records && Array.isArray(recordsCollection.records)) {
					for (const record of recordsCollection.records as IDataObject[]) {
						const values: IDataObject = {};
						const cellValues = record.cellValues as IDataObject;

						if (cellValues?.values && Array.isArray(cellValues.values)) {
							for (const cv of cellValues.values as IDataObject[]) {
								const fieldKey = cv.field_key as string;
								const valueType = cv.value_type as string;
								const value = cv.value as string;
								values[fieldKey] = buildCellValue(valueType, value);
							}
						}

						records.push({
							record_id: record.record_id,
							values,
						});
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/update_records', {
					docid,
					sheet_id,
					key_type,
					records,
				});
			}
			// 获取文档数据
			else if (operation === 'getDocData') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/document/get', { docid });
			} else if (operation === 'getSheetRange') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/spreadsheet/get_sheet_properties', { docid });
			} else if (operation === 'getSheetData') {
				const docid = this.getNodeParameter('docid', i) as string;
				const range = this.getNodeParameter('range', i, '') as string;

				const body: IDataObject = { docid };
				if (range) body.range = range;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/spreadsheet/get_sheet_range_data', body);
			}
			// 获取智能表格数据
			else if (operation === 'querySmartsheetSheet') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_sheet', { docid });
			} else if (operation === 'querySmartsheetView') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_ids_str = this.getNodeParameter('view_ids', i, '') as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { docid, sheet_id, offset, limit };
				if (view_ids_str) {
					body.view_ids = view_ids_str.split(',').map((id) => id.trim()).filter((id) => id);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_views', body);
			} else if (operation === 'querySmartsheetField') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const field_ids_str = this.getNodeParameter('field_ids', i, '') as string;
				const offset = this.getNodeParameter('offset', i, 0) as number;
				const limit = this.getNodeParameter('limit', i, 100) as number;

				const body: IDataObject = { docid, sheet_id, offset, limit };
				if (field_ids_str) {
					body.field_ids = field_ids_str.split(',').map((id) => id.trim()).filter((id) => id);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_fields', body);
			} else if (operation === 'querySmartsheetRecord') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const view_id = this.getNodeParameter('view_id', i, '') as string;
				const key_type = this.getNodeParameter('key_type', i, 'CELL_VALUE_KEY_TYPE_FIELD_TITLE') as string;
				const record_ids_str = this.getNodeParameter('record_ids', i, '') as string;

				const body: IDataObject = { docid, sheet_id, key_type };
				if (view_id) body.view_id = view_id;

				// 处理记录ID
				if (record_ids_str) {
					const record_ids = record_ids_str.split(',').map((id) => id.trim()).filter((id) => id);
					if (record_ids.length > 0) {
						body.record_ids = record_ids;
					}
				}

				// 处理筛选条件
				const filterConditions = this.getNodeParameter('filterConditions', i, {}) as IDataObject;
				const conjunction = this.getNodeParameter('conjunction', i, 'CONJUNCTION_AND') as string;

				let hasFilter = false;
				if (filterConditions.conditions && Array.isArray(filterConditions.conditions)) {
					const conditions = filterConditions.conditions as Array<{
						field_id: string;
						field_type: string;
						operator: string;
						value?: string;
					}>;

					if (conditions.length > 0) {
						const apiConditions = conditions.map((condition) => {
							const apiCondition: IDataObject = {
								field_id: condition.field_id,
								field_type: condition.field_type,
								operator: condition.operator,
							};

							if (!['OPERATOR_IS_EMPTY', 'OPERATOR_IS_NOT_EMPTY'].includes(condition.operator) && condition.value) {
								const values = condition.value.split(',').map((v) => v.trim()).filter((v) => v);

								if (condition.field_type === 'FIELD_TYPE_NUMBER') {
									apiCondition.number_value = { value: values.map((v) => parseFloat(v)) };
								} else {
									apiCondition.string_value = { value: values };
								}
							}

							return apiCondition;
						});

						body.filter_spec = {
							conjunction,
							conditions: apiConditions,
						};
						hasFilter = true;
					}
				}

				// 处理分页
				const pagination = this.getNodeParameter('pagination', i, {}) as IDataObject;
				body.limit = pagination.limit !== undefined ? pagination.limit : 50;
				body.offset = pagination.offset !== undefined ? pagination.offset : 0;

				// 处理排序
				const sortConfig = this.getNodeParameter('sort', i, {}) as IDataObject;
				let hasSortRules = false;
				if (sortConfig.rules && Array.isArray(sortConfig.rules) && sortConfig.rules.length > 0) {
					const sortRules = sortConfig.rules as Array<{
						sort_key_type?: string;
						field_id?: string;
						field_title?: string;
						desc: boolean;
					}>;

					body.sort = sortRules.map((rule) => {
						const sortItem: IDataObject = { desc: rule.desc };

						if (rule.sort_key_type === 'field_title' && rule.field_title) {
							sortItem.field_title = rule.field_title;
						} else if (rule.field_id) {
							sortItem.field_id = rule.field_id;
						}

						return sortItem;
					});
					hasSortRules = true;
				}

				// 检查筛选和排序的冲突
				if (hasSortRules && hasFilter) {
					throw new NodeOperationError(
						this.getNode(),
						'排序规则不能与筛选条件同时使用。请只使用其中一个功能。',
						{ itemIndex: i },
					);
				}

				// 处理返回字段
				const returnFields = this.getNodeParameter('returnFields', i, {}) as IDataObject;
				if (returnFields.field_ids) {
					const fieldIds = (returnFields.field_ids as string).split(',').map((id) => id.trim()).filter((id) => id);
					if (fieldIds.length > 0) {
						body.field_ids = fieldIds;
					}
				}
				if (returnFields.field_titles) {
					const fieldTitles = (returnFields.field_titles as string).split(',').map((title) => title.trim()).filter((title) => title);
					if (fieldTitles.length > 0) {
						body.field_titles = fieldTitles;
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/get_records', body);
			}
			// 权限设置
			else if (operation === 'getDocAuth') {
				const docid = this.getNodeParameter('docid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/doc_get_auth', { docid });
			} else if (operation === 'modDocSafeRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const watermark_enable = this.getNodeParameter('watermark_enable', i, false) as boolean;
				const allow_download = this.getNodeParameter('allow_download', i, true) as boolean;
				const allow_print = this.getNodeParameter('allow_print', i, true) as boolean;
				const allow_copy = this.getNodeParameter('allow_copy', i, true) as boolean;

				const safe_setting: IDataObject = {
					allow_download,
					allow_print,
					allow_copy,
				};

				if (watermark_enable) {
					const watermark_type = this.getNodeParameter('watermark_type', i, 1) as number;
					const watermark: IDataObject = {
						enable: true,
						type: watermark_type,
					};
					if (watermark_type === 2) {
						watermark.text = this.getNodeParameter('watermark_text', i, '') as string;
					}
					safe_setting.watermark = watermark;
				} else {
					safe_setting.watermark = { enable: false };
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_safe_setting', {
					docid,
					safe_setting,
				});
			} else if (operation === 'modDocMemberRule') {
				const docid = this.getNodeParameter('docid', i) as string;
				const addMemberCollection = this.getNodeParameter('addMemberCollection', i, {}) as IDataObject;
				const delMemberCollection = this.getNodeParameter('delMemberCollection', i, {}) as IDataObject;
				const updateMemberCollection = this.getNodeParameter('updateMemberCollection', i, {}) as IDataObject;

				const body: IDataObject = { docid };

				if (addMemberCollection.members && Array.isArray(addMemberCollection.members)) {
					body.add_member_info = (addMemberCollection.members as IDataObject[]).map(buildMemberInfo);
				}

				if (delMemberCollection.members && Array.isArray(delMemberCollection.members)) {
					body.del_member_info = (delMemberCollection.members as IDataObject[]).map(buildMemberInfo);
				}

				if (updateMemberCollection.members && Array.isArray(updateMemberCollection.members)) {
					body.update_member_info = (updateMemberCollection.members as IDataObject[]).map(buildMemberInfo);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_member', body);
			} else if (operation === 'modDocShareScope') {
				const docid = this.getNodeParameter('docid', i) as string;
				const coAuthCollection = this.getNodeParameter('coAuthCollection', i, {}) as IDataObject;
				const enable_readonly_copy = this.getNodeParameter('enable_readonly_copy', i, true) as boolean;
				const ban_share_external = this.getNodeParameter('ban_share_external', i, false) as boolean;
				const share_scope = this.getNodeParameter('share_scope', i, 1) as number;

				const body: IDataObject = {
					docid,
					enable_readonly_copy,
					ban_share_external,
					share_scope,
				};

				if (coAuthCollection.members && Array.isArray(coAuthCollection.members)) {
					body.co_auth_list = (coAuthCollection.members as IDataObject[]).map(buildMemberInfo);
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_doc_join_rule', body);
			} else if (operation === 'manageSmartsheetAuth') {
				const docid = this.getNodeParameter('docid', i) as string;
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const enable = this.getNodeParameter('enable', i, false) as boolean;

				const body: IDataObject = { docid, sheet_id, enable };

				if (enable) {
					const defaultRule = this.getNodeParameter('defaultRule', i, {}) as IDataObject;
					if (Object.keys(defaultRule).length > 0) {
						body.default_rule = defaultRule;
					}

					const userRulesCollection = this.getNodeParameter('userRulesCollection', i, {}) as IDataObject;
					if (userRulesCollection.rules && Array.isArray(userRulesCollection.rules)) {
						body.user_rules = (userRulesCollection.rules as IDataObject[]).map((rule) => ({
							userid: rule.userid,
							read: rule.read,
							edit: rule.edit,
						}));
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/smartsheet/set_sheet_permissions', body);
			}
			// 收集表
			else if (operation === 'createForm') {
				const docid = this.getNodeParameter('docid', i) as string;
				const form_title = this.getNodeParameter('form_title', i) as string;
				const form_description = this.getNodeParameter('form_description', i, '') as string;
				const questionList = this.getNodeParameter('questionList', i, {}) as IDataObject;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const form_info: IDataObject = {
					title: form_title,
				};

				if (form_description) {
					form_info.description = form_description;
				}

				// 构建问题列表
				if (questionList.questions && Array.isArray(questionList.questions)) {
					form_info.question_list = (questionList.questions as IDataObject[]).map((q, idx) => {
						const question: IDataObject = {
							question_id: idx + 1,
							title: q.question_title,
							type: q.question_type,
							is_required: q.is_required || false,
						};

						// 处理选项
						if ([3, 4, 5].includes(q.question_type as number) && q.options) {
							question.options = (q.options as string).split(',').map((opt, optIdx) => ({
								option_id: optIdx + 1,
								text: opt.trim(),
							}));
						}

						return question;
					});
				}

				// 构建设置
				if (Object.keys(formSetting).length > 0) {
					form_info.setting = formSetting;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_form', {
					docid,
					form_info,
				});
			} else if (operation === 'modForm') {
				const formid = this.getNodeParameter('formid', i) as string;
				const form_title = this.getNodeParameter('form_title', i, '') as string;
				const form_description = this.getNodeParameter('form_description', i, '') as string;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const form_info: IDataObject = {};

				if (form_title) {
					form_info.title = form_title;
				}

				if (form_description) {
					form_info.description = form_description;
				}

				if (Object.keys(formSetting).length > 0) {
					form_info.setting = formSetting;
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/mod_form', {
					formid,
					form_info,
				});
			} else if (operation === 'getFormInfo') {
				const formid = this.getNodeParameter('formid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_info', { formid });
			} else if (operation === 'getFormStatistic') {
				const formid = this.getNodeParameter('formid', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_statistic', { formid });
			} else if (operation === 'getFormAnswer') {
				const formid = this.getNodeParameter('formid', i) as string;
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const offset = this.getNodeParameter('offset', i, 0) as number;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_answer', {
					formid,
					limit,
					offset,
				});
			}
			// 高级账号管理
			else if (operation === 'allocateAdvancedAccount') {
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip_batch_add', {
					userid_list: userid_list.split(',').map((id) => id.trim()).filter((id) => id),
				});
			} else if (operation === 'deallocateAdvancedAccount') {
				const userid_list = this.getNodeParameter('userid_list', i) as string;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip_batch_del', {
					userid_list: userid_list.split(',').map((id) => id.trim()).filter((id) => id),
				});
			} else if (operation === 'getAdvancedAccountList') {
				const limit = this.getNodeParameter('limit', i, 100) as number;
				const cursor = this.getNodeParameter('cursor', i, '') as string;

				const body: IDataObject = { limit };
				if (cursor) body.cursor = cursor;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/vip_list', body);
			}
			// 素材管理
			else if (operation === 'uploadDocImage') {
				const docid = this.getNodeParameter('docid', i) as string;
				const binaryPropertyName = this.getNodeParameter('file', i, 'data') as string;
				const filename = this.getNodeParameter('filename', i, '') as string;

				const binaryData = this.helpers.assertBinaryData(i, binaryPropertyName);
				const dataBuffer = await this.helpers.getBinaryDataBuffer(i, binaryPropertyName);

				const accessToken = await getAccessToken.call(this);

				const uploadOptions = {
					method: 'POST' as const,
					url: 'https://qyapi.weixin.qq.com/cgi-bin/wedoc/upload_img',
					qs: {
						access_token: accessToken,
						docid,
					},
					formData: {
						media: {
							value: dataBuffer,
							options: {
								filename: filename || binaryData.fileName || 'image.jpg',
								contentType: binaryData.mimeType,
							},
						},
					},
					json: true,
				};

				response = await this.helpers.httpRequest(uploadOptions) as IDataObject;

				if (response.errcode !== undefined && response.errcode !== 0) {
					throw new Error(`企业微信 API 错误: ${response.errmsg} (错误码: ${response.errcode})`);
				}
			} else {
				response = {};
			}

			returnData.push({
				json: response,
				pairedItem: { item: i },
			});
		} catch (error) {
			if (this.continueOnFail()) {
				returnData.push({
					json: {
						error: error.message,
					},
					pairedItem: { item: i },
				});
				continue;
			}
			throw error;
		}
	}

	return returnData;
}
