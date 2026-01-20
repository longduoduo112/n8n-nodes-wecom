import type { INodeProperties } from 'n8n-workflow';

const showOnly = {
	resource: ['school'],
	operation: ['createStudent'],
};

export const createStudentDescription: INodeProperties[] = [
	{
		displayName: '学生UserID',
		name: 'student_userid',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '学生UserID，学校内必须唯一，长度为1~64个字节',
	},
	{
		displayName: '学生姓名',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '学生姓名，长度为1~32个字符',
	},
	{
		displayName: '班级ID列表',
		name: 'department',
		type: 'string',
		required: true,
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '学生所在的班级id列表，不超过20个，用逗号分隔',
	},
	{
		displayName: '学生手机号',
		name: 'mobile',
		type: 'string',
		displayOptions: {
			show: showOnly,
		},
		default: '',
		description: '学生手机号',
	},
	{
		displayName: '是否发起邀请',
		name: 'to_invite',
		type: 'boolean',
		displayOptions: {
			show: showOnly,
		},
		default: true,
		description: '是否发起邀请，默认为true，仅验证的学校才能发起邀请',
	},
];
