import type { IExecuteFunctions, INodeExecutionData, IDataObject } from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';
import { weComApiRequest, getAccessToken } from '../../shared/transport';

// 辅助函数：从字段值对象中提取实际值
function extractFieldValue(cv: IDataObject): string | number | boolean {
	const valueType = cv.value_type as string;

	switch (valueType) {
		case 'text': {
			// 文本类型 - 检查输入方式
			const textInputMode = cv.text_input_mode as string;
			if (textInputMode === 'json') {
				// JSON输入模式
				return (cv.text_json_data as string) || '[]';
			}
			// 简单输入模式
			return (cv.text_value as string) || '';
		}

		case 'email':
		case 'phone_number':
		case 'barcode':
			return (cv.simple_text_value as string) || '';

		case 'number':
		case 'progress':
		case 'currency':
		case 'percentage':
			return (cv.number_value as number) || 0;

		case 'checkbox':
			return (cv.checkbox_value as boolean) || false;

		case 'date_time':
			return (cv.date_value as string) || '';

		case 'url':
			// 构建URL对象
			return JSON.stringify({
				link: cv.url_link || '',
				text: cv.url_text || cv.url_link || '',
			});

		case 'single_select':
		case 'select':
			// 构建选项对象
			if (cv.option_mode === 'id') {
				return JSON.stringify({ id: cv.option_id || '' });
			} else {
				return JSON.stringify({
					text: cv.option_text || '',
					style: cv.option_style || 1,
				});
			}

		case 'user': {
			// 成员类型 - 检查输入方式
			const userInputMode = cv.user_input_mode as string;
			if (userInputMode === 'json') {
				// JSON输入模式
				return (cv.user_json_data as string) || '[]';
			}
			// 简单输入模式 - 构建成员数组
			const userIds = (cv.user_ids as string || '').split(',').map((id) => id.trim()).filter((id) => id);
			return JSON.stringify(userIds.map((id) => ({ user_id: id })));
		}

		case 'location': {
			// 地点类型 - 检查输入方式
			const locationInputMode = cv.location_input_mode as string;
			if (locationInputMode === 'json') {
				// JSON输入模式
				return (cv.location_json_data as string) || '{}';
			}
			// 表单输入模式 - 构建地点对象
			return JSON.stringify({
				source_type: cv.location_source_type || 1,
				id: cv.location_id || '',
				latitude: cv.location_latitude || '',
				longitude: cv.location_longitude || '',
				title: cv.location_title || '',
			});
		}

		case 'image': {
			// 图片类型 - 检查输入方式
			const imageInputMode = cv.image_input_mode as string;
			if (imageInputMode === 'json') {
				// JSON输入模式
				return (cv.image_json_data as string) || '[]';
			}
			// 表单输入模式 - 构建图片数组
			const imageList = cv.image_list as IDataObject;
			if (imageList?.images && Array.isArray(imageList.images)) {
				return JSON.stringify(
					(imageList.images as IDataObject[]).map((img: IDataObject) => ({
						id: img.id || '',
						title: img.title || '',
						image_url: img.image_url || '',
						width: img.width || 0,
						height: img.height || 0,
					})),
				);
			}
			return '[]';
		}

		case 'attachment': {
			// 文件类型 - 检查输入方式
			const attachmentInputMode = cv.attachment_input_mode as string;
			if (attachmentInputMode === 'json') {
				// JSON输入模式
				return (cv.attachment_json_data as string) || '[]';
			}
			// 表单输入模式 - 构建文件数组
			const attachmentList = cv.attachment_list as IDataObject;
			if (attachmentList?.attachments && Array.isArray(attachmentList.attachments)) {
				return JSON.stringify(
					(attachmentList.attachments as IDataObject[]).map((att: IDataObject) => {
						const docType = att.doc_type as string;
						let fileType = '';
						let fileExt = '';
						let docTypeNum = 2; // 默认为文件

						// 判断是文件夹还是文件
						if (docType === 'folder') {
							// 文件夹
							fileType = 'Folder';
							fileExt = '';
							docTypeNum = 1;
						} else {
							// 文件 - 根据子类型映射
							docTypeNum = 2;
							const subtype = att.file_subtype as string;

							switch (subtype) {
								case 'smartsheet':
									fileType = '70';
									fileExt = 'SMARTSHEET';
									break;
								case 'doc':
									fileType = '50';
									fileExt = 'DOC';
									break;
								case 'sheet':
									fileType = '51';
									fileExt = 'SHEET';
									break;
								case 'slide':
									fileType = '52';
									fileExt = 'SLIDE';
									break;
								case 'mind':
									fileType = '54';
									fileExt = 'MIND';
									break;
								case 'flowchart':
									fileType = '55';
									fileExt = 'FLOWCHART';
									break;
								case 'form':
									fileType = '30';
									fileExt = 'FORM';
									break;
								case 'wedrive':
									fileType = 'Wedrive';
									fileExt = (att.file_ext_custom as string) || '';
									break;
								default:
									fileType = '';
									fileExt = '';
							}
						}

						return {
							file_id: att.file_id || '',
							name: att.name || '',
							file_url: att.file_url || '',
							file_type: fileType,
							file_ext: fileExt,
							doc_type: docTypeNum,
							size: att.size || 0,
						};
					}),
				);
			}
			return '[]';
		}

		default:
			// 默认返回空字符串
			return '';
	}
}

// 辅助函数：构建单元格值 (返回数组格式)
function buildCellValue(valueType: string, value: string): IDataObject[] {
	let cellValueItem: IDataObject;

	switch (valueType) {
		case 'text':
			// 文本类型
			cellValueItem = { type: 'text', text: value };
			break;

		case 'number':
			// 数字类型
			cellValueItem = { type: 'number', number: parseFloat(value) || 0 };
			break;

		case 'checkbox':
			// 复选框类型
			cellValueItem = { type: 'checkbox', checkbox: value.toLowerCase() === 'true' || value === '1' };
			break;

		case 'date_time':
			// 日期类型 - 以毫秒为单位的unix时间戳
			cellValueItem = { type: 'date_time', date_time: value };
			break;

		case 'url':
			// 链接类型 - 支持JSON格式或简单字符串
			try {
				const urlData = typeof value === 'string' && value.startsWith('{') ? JSON.parse(value) : null;
				if (urlData && urlData.link) {
					// JSON格式：{"link": "https://...", "text": "显示文本"}
					cellValueItem = {
						type: 'url',
						link: urlData.link,
						text: urlData.text || urlData.link,
					};
				} else {
					// 简单字符串格式：直接使用value作为link和text
					cellValueItem = { type: 'url', link: value, text: value };
				}
			} catch {
				// 如果JSON解析失败，使用简单格式
				cellValueItem = { type: 'url', link: value, text: value };
			}
			break;

		case 'email':
			// 邮箱类型
			cellValueItem = { type: 'email', email: value };
			break;

		case 'phone_number':
			// 电话类型
			cellValueItem = { type: 'phone_number', phone_number: value };
			break;

		case 'single_select':
		case 'select':
			// 单选/多选类型
			try {
				const optionData = typeof value === 'string' ? JSON.parse(value) : value;
				const option: IDataObject = {};

				// id: 选项ID，当选项存在时使用
				if (optionData.id) {
					option.id = optionData.id;
				}
				// style: 选项颜色，新增选项时填写
				if (optionData.style !== undefined) {
					option.style = optionData.style;
				}
				// text: 选项内容，新增选项时填写
				if (optionData.text) {
					option.text = optionData.text;
				}

				cellValueItem = { type: valueType, [valueType]: option };
			} catch (error) {
				throw new Error(`${valueType}类型值格式错误，请提供有效的JSON格式: ${error.message}`);
			}
			break;

		case 'progress':
			// 进度类型 (0-1之间的数值)
			cellValueItem = { type: 'progress', progress: parseFloat(value) || 0 };
			break;

		case 'currency':
			// 货币类型
			cellValueItem = { type: 'currency', currency: parseFloat(value) || 0 };
			break;

		case 'percentage':
			// 百分数类型
			cellValueItem = { type: 'percentage', percentage: parseFloat(value) || 0 };
			break;

		case 'barcode':
			// 条码类型
			cellValueItem = { type: 'barcode', barcode: value };
			break;

		case 'location':
			// 地理位置类型
			try {
				const locationData = typeof value === 'string' ? JSON.parse(value) : value;
				const location: IDataObject = {
					source_type: locationData.source_type || 1, // 默认为1（腾讯地图）
				};

				// 必填字段
				if (!locationData.id) {
					throw new Error('地点类型缺少必填字段: id');
				}
				if (!locationData.latitude) {
					throw new Error('地点类型缺少必填字段: latitude');
				}
				if (!locationData.longitude) {
					throw new Error('地点类型缺少必填字段: longitude');
				}
				if (!locationData.title) {
					throw new Error('地点类型缺少必填字段: title');
				}

				location.id = locationData.id;
				location.latitude = locationData.latitude;
				location.longitude = locationData.longitude;
				location.title = locationData.title;

				cellValueItem = { type: 'location', location };
			} catch (error) {
				throw new Error(`地点类型值格式错误: ${error.message}`);
			}
			break;

		case 'image':
			// 图片类型 - 需要JSON数组格式
			try {
				const imageData = typeof value === 'string' ? JSON.parse(value) : value;
				if (!Array.isArray(imageData)) {
					throw new Error('图片类型需要数组格式');
				}
				cellValueItem = { type: 'image', image: imageData };
			} catch (error) {
				throw new Error(`图片类型值格式错误: ${error.message}`);
			}
			break;

		case 'attachment':
			// 文件类型 - 需要JSON数组格式
			try {
				const attachmentData = typeof value === 'string' ? JSON.parse(value) : value;
				if (!Array.isArray(attachmentData)) {
					throw new Error('文件类型需要数组格式');
				}
				cellValueItem = { type: 'attachment', attachment: attachmentData };
			} catch (error) {
				throw new Error(`文件类型值格式错误: ${error.message}`);
			}
			break;

		case 'user': {
			// 成员类型 - 支持多种格式
			try {
				let userData: IDataObject[];

				if (typeof value === 'string' && (value.startsWith('[') || value.startsWith('{'))) {
					// JSON格式
					const parsed = JSON.parse(value);
					if (Array.isArray(parsed)) {
						// 数组格式：[{"user_id": "userid1"}, {"user_id": "userid2"}]
						userData = parsed;
					} else if (parsed.user_id) {
						// 单个对象格式：{"user_id": "userid1"}
						userData = [parsed];
					} else {
						throw new Error('成员对象必须包含 user_id 字段');
					}
				} else {
					// 简单字符串格式：直接作为user_id
					userData = [{ user_id: value }];
				}

				cellValueItem = { type: 'user', user: userData };
			} catch (error) {
				throw new Error(`成员类型值格式错误: ${error.message}`);
			}
			break;
		}

		default:
			// 默认为文本类型
			cellValueItem = { type: 'text', text: value };
			break;
	}

	// 根据文档，值应该是数组格式
	return [cellValueItem];
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
								// 使用新的提取函数从结构化字段中获取值
								const value = extractFieldValue(cv);
								values[fieldKey] = buildCellValue(valueType, String(value));
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
								// 使用新的提取函数从结构化字段中获取值
								const value = extractFieldValue(cv);
								values[fieldKey] = buildCellValue(valueType, String(value));
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
				const sheet_id = this.getNodeParameter('sheet_id', i) as string;
				const range = this.getNodeParameter('range', i) as string;

				const body: IDataObject = { docid, sheet_id, range };

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
				const spaceid = this.getNodeParameter('spaceid', i, '') as string;
				const fatherid = this.getNodeParameter('fatherid', i, '') as string;
				const form_title = this.getNodeParameter('form_title', i) as string;
				const form_description = this.getNodeParameter('form_description', i, '') as string;
				const questionList = this.getNodeParameter('questionList', i, {}) as IDataObject;
				const formSetting = this.getNodeParameter('formSetting', i, {}) as IDataObject;

				const body: IDataObject = {};

				// 添加 spaceid 和 fatherid（如果提供）
				if (spaceid) {
					body.spaceid = spaceid;
				}
				if (fatherid) {
					body.fatherid = fatherid;
				}

				const form_info: IDataObject = {
					form_title: form_title,
				};

				if (form_description) {
					form_info.form_desc = form_description;
				}

				// 构建问题列表
				if (questionList.questions && Array.isArray(questionList.questions)) {
					const items = (questionList.questions as IDataObject[]).map((q, idx) => {
						const question: IDataObject = {
							question_id: idx + 1,
							title: q.question_title,
							pos: idx + 1,
							status: 1,
							reply_type: q.question_type,
							must_reply: q.is_required || false,
						};

						// 处理选项（单选/多选/下拉列表）
						if ([2, 3, 15].includes(q.question_type as number) && q.options) {
							question.option_item = (q.options as string).split(',').map((opt, optIdx) => ({
								key: optIdx + 1,
								value: opt.trim(),
								status: 1,
							}));
						}

						return question;
					});

					form_info.form_question = { items };
				}

				// 构建设置
				if (Object.keys(formSetting).length > 0) {
					// 处理 timed_finish：将日期时间转换为时间戳并验证
					if (formSetting.timed_finish) {
						const timedFinish = formSetting.timed_finish as string;
						if (timedFinish) {
							const finishTime = new Date(timedFinish).getTime();
							const currentTime = Date.now();

							// 验证：时间不能早于当前时间
							if (finishTime < currentTime) {
								throw new Error('定时关闭时间不能早于当前时间');
							}

							// 转换为秒级时间戳
							formSetting.timed_finish = Math.floor(finishTime / 1000);
						}
					}

					// 处理 setting_manager_range：将逗号分隔的userid字符串转换为对象数组
					if (formSetting.setting_manager_range) {
						const managerRange = formSetting.setting_manager_range as string;
						if (managerRange && managerRange.trim()) {
							const userids = managerRange.split(',').map((id) => id.trim()).filter((id) => id);
							if (userids.length > 0) {
								formSetting.setting_manager_range = { userids };
							} else {
								delete formSetting.setting_manager_range;
							}
						} else {
							delete formSetting.setting_manager_range;
						}
					}

					form_info.form_setting = formSetting;
				}

				body.form_info = form_info;

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/create_form', body);
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
			}
			// 收集表的统计信息查询
			else if (operation === 'getFormStatistic') {
				const repeated_id = this.getNodeParameter('repeated_id', i) as string;
				const req_type = this.getNodeParameter('req_type', i) as number;

				const body: IDataObject = {
					repeated_id,
					req_type,
				};

				// 如果是获取已提交列表（req_type=2），需要时间范围
				if (req_type === 2) {
					const start_time = this.getNodeParameter('start_time', i) as string;
					const end_time = this.getNodeParameter('end_time', i) as string;

					// 将日期时间转换为秒级时间戳
					body.start_time = Math.floor(new Date(start_time).getTime() / 1000);
					body.end_time = Math.floor(new Date(end_time).getTime() / 1000);

					// 添加分页参数
					const limit = this.getNodeParameter('limit', i, 20) as number;
					const cursor = this.getNodeParameter('cursor', i, 0) as number;
					body.limit = limit;
					if (cursor > 0) {
						body.cursor = cursor;
					}
				}
				// 如果是获取未提交列表（req_type=3），需要分页参数
				else if (req_type === 3) {
					const limit = this.getNodeParameter('limit', i, 20) as number;
					const cursor = this.getNodeParameter('cursor', i, 0) as number;
					body.limit = limit;
					if (cursor > 0) {
						body.cursor = cursor;
					}
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_statistic', body);
			}
			// 读取收集表答案
			else if (operation === 'getFormAnswer') {
				const repeated_id = this.getNodeParameter('repeated_id', i) as string;
				const answer_ids_str = this.getNodeParameter('answer_ids', i) as string;

				// 将答案ID字符串转换为数字数组
				const answer_ids = answer_ids_str
					.split(',')
					.map((id) => parseInt(id.trim(), 10))
					.filter((id) => !isNaN(id));

				// 验证答案ID列表
				if (answer_ids.length === 0) {
					throw new NodeOperationError(this.getNode(), '答案ID列表不能为空', { itemIndex: i });
				}
				if (answer_ids.length > 100) {
					throw new NodeOperationError(this.getNode(), '答案ID列表最大不能超过100个', { itemIndex: i });
				}

				response = await weComApiRequest.call(this, 'POST', '/cgi-bin/wedoc/get_form_answer', {
					repeated_id,
					answer_ids,
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
