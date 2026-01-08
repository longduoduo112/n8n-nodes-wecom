import type { INodeProperties } from 'n8n-workflow';

const showOnly = { resource: ['live'], operation: ['modifyLiving'] };

export const modifyLivingDescription: INodeProperties[] = [
	{
		displayName: '直播ID',
		name: 'livingid',
		type: 'string',
		required: true,
		displayOptions: { show: showOnly },
		default: '',
		placeholder: 'livingid',
	},
	{
		displayName: '可选参数',
		name: 'additionalFields',
		type: 'collection',
		placeholder: '添加可选参数',
		default: {},
		displayOptions: { show: showOnly },
		options: [
			{
				displayName: '活动详情图片URL列表',
				name: 'activity_detail_image_list',
				type: 'string',
				default: '',
				description: '活动详情图片URL，多个URL用英文逗号分隔，最多3张',
				placeholder: 'http://url1,http://url2',
			},
			{
				displayName: '活动详情文字',
				name: 'activity_detail_description',
				type: 'string',
				default: '',
				description: '活动详情文字，最多支持300个汉字',
			},
			{
				displayName: '开播提醒时间',
				name: 'remind_time',
				type: 'options',
				options: [
					{ name: '不提醒', value: 0 },
					{ name: '提前1分钟', value: 60 },
				],
				default: 60,
				description: '开播前多久提醒（秒）',
			},
			{
				displayName: '直播持续时长',
				name: 'living_duration',
				type: 'number',
				default: 0,
				description: '直播持续时长（秒）',
				typeOptions: { minValue: 1, maxValue: 86400 },
			},
			{
				displayName: '直播分享封面MediaID',
				name: 'activity_share_mediaid',
				type: 'string',
				default: '',
				description: '直播分享封面，使用上传临时素材接口得到的mediaid',
			},
			{
				displayName: '直播封面MediaID',
				name: 'activity_cover_mediaid',
				type: 'string',
				default: '',
				description: '直播封面，使用上传临时素材接口得到的mediaid',
			},
			{
				displayName: '直播简介',
				name: 'description',
				type: 'string',
				default: '',
			},
			{
				displayName: '直播开始时间',
				name: 'living_start',
				type: 'number',
				default: 0,
				description: '直播开始时间（Unix时间戳秒）',
				typeOptions: { minValue: 0 },
			},
			{
				displayName: '直播类型',
				name: 'type',
				type: 'options',
				options: [
					{ name: '通用直播', value: 0 },
					{ name: '小班课', value: 1 },
				],
				default: 0,
			},
			{
				displayName: '直播主题',
				name: 'theme',
				type: 'string',
				default: '',
				description: '直播主题，最多支持60个汉字',
			},
		],
	},
];
