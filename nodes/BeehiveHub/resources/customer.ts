import type { INodeProperties } from 'n8n-workflow';

const resource = 'customer';

export const customerDescription: INodeProperties[] = [
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
				action: 'Create a customer',
				description: 'Create a new customer',
				routing: {
					request: { method: 'POST', url: '/customers' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a customer',
				description: 'Get a customer by ID',
				routing: {
					request: { method: 'GET', url: '=/customers/{{$parameter.customerId}}' },
				},
			},
			{
				name: 'Get Many',
				value: 'getMany',
				action: 'Get many customers',
				description: 'List all customers',
				routing: {
					request: {
						method: 'GET',
						url: '/customers',
						headers: {
							Accept: '*/*, application/json',
							'Content-Type': '*/*, application/json',
						},
					},
				},
			},
		],
		default: 'create',
	},

	{
		displayName: 'Customer ID',
		name: 'customerId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get'] } },

	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'email@example.com',
		displayOptions: { show: { resource: [resource], operation: ['getMany'] } },
		description: 'Customer email to search by',
		routing: { send: { type: 'query', property: 'email' } },
	},

	{
		displayName: 'Name',
		name: 'name',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Customer name',
		routing: { send: { type: 'body', property: 'name' } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'email@example.com',
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Customer email',
		routing: { send: { type: 'body', property: 'email' } },
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		options: [
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
				placeholder: '11999999999',
				description: 'Customer phone number',
				routing: { send: { type: 'body', property: 'phone' } },
			},
			{
				displayName: 'Document',
				name: 'document',
				type: 'fixedCollection',
				default: { documentValues: { number: '', type: 'cpf' } },
				options: [
					{
						displayName: 'Document',
						name: 'documentValues',
						values: [
							{
								displayName: 'Document Number',
								name: 'number',
								type: 'string',
								required: true,
								default: '',
								description: 'CPF or CNPJ document number',
								routing: { send: { type: 'body', property: 'document.number' } },
							},
							{
								displayName: 'Document Type',
								name: 'type',
								type: 'options',
								required: true,
								default: 'cpf',
								options: [
									{ name: 'CPF', value: 'cpf' },
									{ name: 'CNPJ', value: 'cnpj' },
								],

								routing: { send: { type: 'body', property: 'document.type' } },
							},
						],
					},
				],
			},
			{
				displayName: 'External Reference',
				name: 'externalRef',
				type: 'string',
				default: '',
				description: 'External reference for the customer',
				routing: { send: { type: 'body', property: 'externalRef' } },
			},
		],
	},

	{
		displayName: 'Address',
		name: 'addressFields',
		type: 'collection',
		placeholder: 'Add Address Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Customer address (optional)',
		options: [
			{
				displayName: 'City',
				name: 'city',
				type: 'string',
				default: '',
				description: 'City name',
				routing: { send: { type: 'body', property: 'address.city' } },
			},
			{
				displayName: 'Complement',
				name: 'complement',
				type: 'string',
				default: '',
				description: 'Address complement',
				routing: { send: { type: 'body', property: 'address.complement' } },
			},
			{
				displayName: 'Country',
				name: 'country',
				type: 'string',
				default: 'br',
				description: 'Country code (br)',
				routing: { send: { type: 'body', property: 'address.country' } },
			},
			{
				displayName: 'Neighborhood',
				name: 'neighborhood',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'address.neighborhood' } },
			},
			{
				displayName: 'State',
				name: 'state',
				type: 'string',
				default: '',
				description: 'State code (SP)',
				routing: { send: { type: 'body', property: 'address.state' } },
			},
			{
				displayName: 'Street',
				name: 'street',
				type: 'string',
				default: '',
				description: 'Street name',
				routing: { send: { type: 'body', property: 'address.street' } },
			},
			{
				displayName: 'Street Number',
				name: 'streetNumber',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'address.streetNumber' } },
			},
			{
				displayName: 'Zip Code',
				name: 'zipCode',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'address.zipCode' } },
			},
		],
	},
];
