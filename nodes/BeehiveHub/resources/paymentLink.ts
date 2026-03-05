import type { INodeProperties } from 'n8n-workflow';

const resource = 'paymentLink';

function generateAlias(length = 10): string {
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
	return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export const paymentLinkDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: [resource] } },
		options: [
			{
				name: 'Create',
				value: 'create',
				action: 'Create a payment link',
				description: 'Create a new payment link',
				routing: {
					request: { method: 'POST', url: '/payment-links' },
				},
			},
			{
				name: 'Delete',
				value: 'delete',
				action: 'Delete a payment link',
				description: 'Delete a payment link by ID',
				routing: {
					request: { method: 'DELETE', url: '=/payment-links/{{$parameter.paymentLinkId}}' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a payment link',
				description: 'Get a payment link by ID',
				routing: {
					request: { method: 'GET', url: '=/payment-links/{{$parameter.paymentLinkId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many payment links',
				description: 'List all payment links',
				routing: {
					request: { method: 'GET', url: '/payment-links' },
				},
			},
			{
				name: 'Update',
				value: 'update',
				action: 'Update a payment link',
				description: 'Update a payment link by ID',
				routing: {
					request: { method: 'PUT', url: '=/payment-links/{{$parameter.paymentLinkId}}' },
				},
			},
		],
		default: 'getMany',
	},

	{
		displayName: 'Payment Link ID',
		name: 'paymentLinkId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get', 'delete', 'update'] } },
	},

	{
		displayName: 'Alias',
		name: 'alias',
		type: 'string',
		default: '',
		placeholder: 'Leave empty to auto-generate',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Unique alias for the payment link. Leave empty to auto-generate.',
		routing: {
			send: {
				type: 'body',
				property: 'alias',
				preSend: [
					async function (this, requestOptions) {
						const alias = this.getNodeParameter('alias') as string;
						requestOptions.body = requestOptions.body ?? {};
						(requestOptions.body as Record<string, unknown>).alias = alias || generateAlias();
						return requestOptions;
					},
				],
			},
		},
	},
	{
		displayName: 'Alias',
		name: 'alias',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['update'] } },
		description: 'Unique alias for the payment link',
		routing: { send: { type: 'body', property: 'alias' } },
	},

	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		routing: { send: { type: 'body', property: 'title' } },
	},

	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Amount in cents (500 = R$ 5.00)',
		routing: { send: { type: 'body', property: 'amount' } },
	},

	{
		displayName: 'Default Payment Method',
		name: 'defaultPaymentMethod',
		type: 'options',
		default: 'pix',
		options: [
			{ name: 'Boleto', value: 'boleto' },
			{ name: 'Credit Card', value: 'credit_card' },
			{ name: 'PIX', value: 'pix' },
		],
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Default payment method for the payment link',
		routing: { send: { type: 'body', property: 'settings.defaultPaymentMethod' } },
	},
	{
		displayName: 'Request Address',
		name: 'requestAddress',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to request address from the customer',
		routing: { send: { type: 'body', property: 'settings.requestAddress' } },
	},
	{
		displayName: 'Request Phone',
		name: 'requestPhone',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to request phone from the customer',
		routing: { send: { type: 'body', property: 'settings.requestPhone' } },
	},
	{
		displayName: 'Request Document',
		name: 'requestDocument',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to request CPF/CNPJ from the customer',
		routing: { send: { type: 'body', property: 'settings.requestDocument' } },
	},
	{
		displayName: 'Traceable',
		name: 'traceable',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to enable delivery status management via dashboard',
		routing: { send: { type: 'body', property: 'settings.traceable' } },
	},
	{
		displayName: 'Card Enabled',
		name: 'cardEnabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to enable credit card payments',
		routing: { send: { type: 'body', property: 'settings.card.enabled' } },
	},
	{
		displayName: 'Card Free Installments',
		name: 'cardFreeInstallments',
		type: 'number',
		default: 1,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Number of interest-free installments',
		routing: { send: { type: 'body', property: 'settings.card.freeInstallments' } },
	},
	{
		displayName: 'Card Max Installments',
		name: 'cardMaxInstallments',
		type: 'number',
		default: 12,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Maximum number of installments',
		routing: { send: { type: 'body', property: 'settings.card.maxInstallments' } },
	},
	{
		displayName: 'PIX Enabled',
		name: 'pixEnabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to enable PIX payments',
		routing: { send: { type: 'body', property: 'settings.pix.enabled' } },
	},
	{
		displayName: 'PIX Expires In Days',
		name: 'pixExpiresInDays',
		type: 'number',
		default: 2,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Number of days until PIX expiration',
		routing: { send: { type: 'body', property: 'settings.pix.expiresInDays' } },
	},
	{
		displayName: 'Boleto Enabled',
		name: 'boletoEnabled',
		type: 'boolean',
		default: true,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Whether to enable boleto payments',
		routing: { send: { type: 'body', property: 'settings.boleto.enabled' } },
	},
	{
		displayName: 'Boleto Expires In Days',
		name: 'boletoExpiresInDays',
		type: 'number',
		default: 2,
		displayOptions: { show: { resource: [resource], operation: ['create', 'update'] } },
		description: 'Number of days until boleto expiration',
		routing: { send: { type: 'body', property: 'settings.boleto.expiresInDays' } },
	},
];
