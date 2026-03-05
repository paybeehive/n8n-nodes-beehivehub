import type { INodeProperties } from 'n8n-workflow';

const resource = 'transfer';

export const transferDescription: INodeProperties[] = [
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
				action: 'Create a transfer',
				description: 'Create a new transfer',
				routing: {
					request: { method: 'POST', url: '/transfers' },
				},
			},
			{
				name: 'Get',
				value: 'get',
				action: 'Get a transfer',
				description: 'Get a transfer by ID',
				routing: {
					request: { method: 'GET', url: '=/transfers/{{$parameter.transferId}}' },
				},
			},
		],
		default: 'create',
	},

	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: [resource], operation: ['get'] } },

	},

	{
		displayName: 'Amount (Cents)',
		name: 'amount',
		type: 'number',
		required: true,
		default: 0,
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Transfer amount in cents (1000 = $10.00)',
		routing: { send: { type: 'body', property: 'amount' } },
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
				displayName: 'Recipient ID',
				name: 'recipientId',
				type: 'number',
				default: 0,
				description: 'Recipient ID. If not provided, the company primary recipient will be used.',
				routing: {
					send: {
						type: 'body',
						property: 'recipientId',
						value: '={{ $value || undefined }}',
					},
				},
			},
			{
				displayName: 'PIX Key',
				name: 'pixKey',
				type: 'string',
				default: '',
				description: 'Destination PIX key. If not provided, the recipient primary bank account will be used.',
				routing: {
					send: {
						type: 'body',
						property: 'pixKey',
						value: '={{ $value || undefined }}',
					},
				},
			},
			{
				displayName: 'Postback URL',
				name: 'postbackUrl',
				type: 'string',
				default: '',
				description: 'URL to receive transfer updates via webhook',
				routing: {
					send: {
						type: 'body',
						property: 'postbackUrl',
						value: '={{ $value || undefined }}',
					},
				},
			},
			{
				displayName: 'External Reference',
				name: 'externalRef',
				type: 'string',
				default: '',
				description: 'External reference for the transfer in your API',
				routing: {
					send: {
						type: 'body',
						property: 'externalRef',
						value: '={{ $value || undefined }}',
					},
				},
			},
		],
	},

	{
		displayName: 'Bank Account',
		name: 'bankAccountFields',
		type: 'collection',
		placeholder: 'Add Bank Account Field',
		default: {},
		displayOptions: { show: { resource: [resource], operation: ['create'] } },
		description: 'Destination bank account. If not provided, the recipient primary account will be used.',
		options: [
			{
				displayName: 'Account Digit',
				name: 'accountDigit',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'bankAccount.accountDigit' } },
			},
			{
				displayName: 'Account Number',
				name: 'accountNumber',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'bankAccount.accountNumber' } },
			},
			{
				displayName: 'Account Type',
				name: 'type',
				type: 'options',
				default: 'conta_corrente',
				options: [
					{ name: 'Checking Account', value: 'conta_corrente' },
					{ name: 'Savings Account', value: 'conta_poupanca' },
				],

				routing: { send: { type: 'body', property: 'bankAccount.type' } },
			},
			{
				displayName: 'Agency Number',
				name: 'agencyNumber',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'bankAccount.agencyNumber' } },
			},
			{
				displayName: 'Bank Code',
				name: 'bankCode',
				type: 'string',
				default: '',

				routing: { send: { type: 'body', property: 'bankAccount.bankCode' } },
			},
			{
				displayName: 'Document Number',
				name: 'documentNumber',
				type: 'string',
				default: '',
				description: 'CPF/CNPJ of the bank account holder',
				routing: { send: { type: 'body', property: 'bankAccount.documentNumber' } },
			},
			{
				displayName: 'Document Type',
				name: 'documentType',
				type: 'options',
				default: 'cpf',
				options: [
					{ name: 'CPF', value: 'cpf' },
					{ name: 'CNPJ', value: 'cnpj' },
				],

				routing: { send: { type: 'body', property: 'bankAccount.documentType' } },
			},
			{
				displayName: 'Legal Name',
				name: 'legalName',
				type: 'string',
				default: '',
				description: 'Company legal name',
				routing: { send: { type: 'body', property: 'bankAccount.legalName' } },
			},
		],
	},
];
