import { NodeConnectionTypes, type INodeType, type INodeTypeDescription } from 'n8n-workflow';
import { transactionDescription } from './resources/transaction';
import { customerDescription } from './resources/customer';
import { transferDescription } from './resources/transfer';
import { balanceDescription } from './resources/balance';
import { paymentLinkDescription } from './resources/paymentLink';

export class BeehiveHub implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'BeehiveHub',
		name: 'beehiveHub',
		icon: 'file:beehive.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Consume the BeehiveHub payment API',
		defaults: {
			name: 'BeehiveHub',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'beehiveHubApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: 'https://api.conta.paybeehive.com.br/v1',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Balance',
						value: 'balance',
					},
					{
						name: 'Customer',
						value: 'customer',
					},
					{
						name: 'Payment Link',
						value: 'paymentLink',
					},
					{
						name: 'Transaction',
						value: 'transaction',
					},
					{
						name: 'Transfer',
						value: 'transfer',
					},
				],
				default: 'transaction',
			},
			...transactionDescription,
			...customerDescription,
			...transferDescription,
			...balanceDescription,
			...paymentLinkDescription,
		],
	};
}
