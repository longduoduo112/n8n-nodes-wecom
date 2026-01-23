import type { IExecuteFunctions, IDataObject  } from 'n8n-workflow';

import { weComApiRequest } from '../../shared/transport';

export async function importDevice(this: IExecuteFunctions): Promise<IDataObject> {
	const deviceList = this.getNodeParameter('device_list', 0) as IDataObject;

	const devices: IDataObject[] = [];

	if (deviceList.device && Array.isArray(deviceList.device)) {
		for (const device of deviceList.device) {
			const deviceData: IDataObject = {
				system: device.system,
			};

			// 处理MAC地址列表
			if (device.mac_addr && Array.isArray(device.mac_addr) && device.mac_addr.length > 0) {
				deviceData.mac_addr = device.mac_addr;
			}

			// Windows设备特有属性
			if (device.system === 'Windows') {
				if (device.motherboard_uuid) {
					deviceData.motherboard_uuid = device.motherboard_uuid;
				}
				if (device.harddisk_uuid && Array.isArray(device.harddisk_uuid) && device.harddisk_uuid.length > 0) {
					deviceData.harddisk_uuid = device.harddisk_uuid;
				}
				if (device.domain) {
					deviceData.domain = device.domain;
				}
				if (device.pc_name) {
					deviceData.pc_name = device.pc_name;
				}
			}

			// Mac设备特有属性
			if (device.system === 'Mac' && device.seq_no) {
				deviceData.seq_no = device.seq_no;
			}

			devices.push(deviceData);
		}
	}

	const body = {
		device_list: devices,
	};

	const responseData = await weComApiRequest.call(
		this,
		'POST',
		'/cgi-bin/security/trustdevice/import',
		body,
	);

	return responseData;
}
