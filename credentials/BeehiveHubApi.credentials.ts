import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class BeehiveHubApi implements ICredentialType {
	name = 'beehiveHubApi';
	displayName = 'BeehiveHub API';
	icon: Icon = 'file:../nodes/BeehiveHub/beehive.svg';
	documentationUrl = 'https://paybeehive.readme.io/reference/introducao';

	properties: INodeProperties[] = [
		{
			displayName: 'Secret Key',
			name: 'secretKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API secret key (sk_live_... or sk_test_...)',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			auth: {
				username: '={{$credentials.secretKey}}',
				password: 'x',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.conta.paybeehive.com.br/v1',
			url: '/transactions',
			method: 'GET',
		},
	};
}