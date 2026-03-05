import type { INodeProperties } from 'n8n-workflow';

const resource = 'balance';

export const balanceDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Get Available',
				value: 'getAvailable',
				action: 'Get available balance',
				description: 'Get the available balance',
				routing: {
					request: { method: 'GET', url: '/balance/available' },
				},
			},
		],
		default: 'getAvailable',
	},

	{
		displayName: 'Recipient ID',
		name: 'recipientId',
		type: 'number',
		default: 0,
		displayOptions: { show: { resource: [resource], operation: ['getAvailable'] } },
		description:
			'Recipient ID. If not provided, the company primary recipient will be used.',
		routing: {
			send: {
				type: 'query',
				property: 'recipientId',
				value: '={{ $value || undefined }}',
			},
		},
	},
];
