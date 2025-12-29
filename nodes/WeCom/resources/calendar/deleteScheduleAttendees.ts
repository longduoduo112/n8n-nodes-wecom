import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['calendar'], operation: ['deleteScheduleAttendees'] };

export const deleteScheduleAttendeesDescription: INodeProperties[] = [
	{
		displayName: '日程ID',
		name: 'schedule_id',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		description: '要删除参与者的日程ID',
	},
	{
		displayName: '参与者',
		name: 'attendeesCollection',
		type: 'fixedCollection',
		required: true,
		displayOptions: { show: showOnly },
		default: {},
		placeholder: '添加要删除的参与者',
		typeOptions: { multipleValues: true },
		description: '要删除的参与者列表',
		options: [
			{
				displayName: '参与者',
				name: 'attendees',
				values: [
					{
						displayName: '成员UserID',
						name: 'userid',
						type: 'string',
						default: '',
						required: true,
						description: '参与者的UserID',
					},
				],
			},
		],
	},
];
