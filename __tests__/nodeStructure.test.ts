import type { INodePropertyOptions } from 'n8n-workflow';
import { BeehiveHub } from '../nodes/BeehiveHub/BeehiveHub.node';
import { BeehiveHubApi } from '../credentials/BeehiveHubApi.credentials';

describe('BeehiveHub Node - Structure & Metadata', () => {
	let node: BeehiveHub;

	beforeAll(() => {
		node = new BeehiveHub();
	});

	describe('Node definition', () => {
		it('should have correct displayName', () => {
			expect(node.description.displayName).toBe('BeehiveHub');
		});

		it('should have correct internal name', () => {
			expect(node.description.name).toBe('beehiveHub');
		});

		it('should be version 1', () => {
			expect(node.description.version).toBe(1);
		});

		it('should have an icon defined', () => {
			expect(node.description.icon).toBeDefined();
			expect(node.description.icon).toContain('beehive');
		});

		it('should be usable as a tool', () => {
			expect(node.description.usableAsTool).toBe(true);
		});

		it('should require beehiveHubApi credentials', () => {
			const creds = node.description.credentials;
			expect(creds).toBeDefined();
			expect(creds).toHaveLength(1);
			expect(creds![0].name).toBe('beehiveHubApi');
			expect(creds![0].required).toBe(true);
		});

		it('should have correct base URL', () => {
			expect(node.description.requestDefaults?.baseURL).toBe(
				'https://api.conta.paybeehive.com.br/v1',
			);
		});

		it('should set JSON content-type headers', () => {
			const headers = node.description.requestDefaults?.headers;
			expect(headers).toBeDefined();
			expect(headers!['Accept']).toBe('application/json');
			expect(headers!['Content-Type']).toBe('application/json');
		});
	});

	describe('Resources', () => {
		const getResourceProperty = () => {
			return node.description.properties.find((p) => p.name === 'resource');
		};

		it('should have a resource selector property', () => {
			const resource = getResourceProperty();
			expect(resource).toBeDefined();
			expect(resource!.type).toBe('options');
		});

		it('should define all 5 resources', () => {
			const resource = getResourceProperty();
			const options = resource!.options as INodePropertyOptions[];
			const values = options.map((o) => o.value);
			expect(values).toContain('balance');
			expect(values).toContain('customer');
			expect(values).toContain('paymentLink');
			expect(values).toContain('transaction');
			expect(values).toContain('transfer');
			expect(options).toHaveLength(5);
		});

		it('should default to transaction resource', () => {
			const resource = getResourceProperty();
			expect(resource!.default).toBe('transaction');
		});
	});

	describe('Credentials definition', () => {
		let creds: BeehiveHubApi;

		beforeAll(() => {
			creds = new BeehiveHubApi();
		});

		it('should have correct credential name', () => {
			expect(creds.name).toBe('beehiveHubApi');
		});

		it('should have correct display name', () => {
			expect(creds.displayName).toBe('BeehiveHub API');
		});

		it('should have a secretKey property', () => {
			const secretKey = creds.properties.find((p) => p.name === 'secretKey');
			expect(secretKey).toBeDefined();
			expect(secretKey!.type).toBe('string');
		});

		it('should mark secretKey as password', () => {
			const secretKey = creds.properties.find((p) => p.name === 'secretKey');
			expect(secretKey!.typeOptions?.password).toBe(true);
		});

		it('should use basic auth with secretKey as username', () => {
			expect(creds.authenticate).toEqual({
				type: 'generic',
				properties: {
					auth: {
						username: '={{$credentials.secretKey}}',
						password: 'x',
					},
				},
			});
		});

		it('should have a credential test request', () => {
			expect(creds.test).toBeDefined();
			expect(creds.test.request.baseURL).toBe(
				'https://api.conta.paybeehive.com.br/v1',
			);
			expect(creds.test.request.url).toBe('/transactions');
			expect(creds.test.request.method).toBe('GET');
		});
	});
});
