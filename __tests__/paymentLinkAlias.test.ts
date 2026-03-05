/**
 * Tests for the generateAlias function used in payment link creation.
 * Since generateAlias is not exported, we test it indirectly through the preSend handler.
 */
import { paymentLinkDescription } from '../nodes/BeehiveHub/resources/paymentLink';

type MockPreSend = (
	this: { getNodeParameter: jest.Mock },
	options: { body: Record<string, unknown> | undefined },
) => Promise<{ body: Record<string, unknown> }>;

describe('Payment Link - Alias Generation', () => {
	const getCreateAliasPreSend = (): MockPreSend => {
		const aliasFields = paymentLinkDescription.filter((p) => p.name === 'alias');
		const createAlias = aliasFields.find((p) =>
			p.displayOptions?.show?.operation?.includes('create'),
		);
		return createAlias!.routing!.send!.preSend![0] as unknown as MockPreSend;
	};

	it('should have a preSend function for alias generation', () => {
		const preSend = getCreateAliasPreSend();
		expect(typeof preSend).toBe('function');
	});

	it('preSend should set alias on the request body when alias is empty', async () => {
		const preSend = getCreateAliasPreSend();
		const mockContext = {
			getNodeParameter: jest.fn().mockReturnValue(''),
		};
		const requestOptions = { body: {} as Record<string, unknown> };

		const result = await preSend.call(mockContext, requestOptions);

		expect(result.body.alias).toBeDefined();
		expect(typeof result.body.alias).toBe('string');
		expect((result.body.alias as string).length).toBe(10);
	});

	it('preSend should use provided alias when not empty', async () => {
		const preSend = getCreateAliasPreSend();
		const mockContext = {
			getNodeParameter: jest.fn().mockReturnValue('my-custom-alias'),
		};
		const requestOptions = { body: {} as Record<string, unknown> };

		const result = await preSend.call(mockContext, requestOptions);

		expect(result.body.alias).toBe('my-custom-alias');
	});

	it('preSend should initialize body if undefined', async () => {
		const preSend = getCreateAliasPreSend();
		const mockContext = {
			getNodeParameter: jest.fn().mockReturnValue('test'),
		};
		const requestOptions = { body: undefined as unknown as Record<string, unknown> };

		const result = await preSend.call(mockContext, requestOptions);

		expect(result.body).toBeDefined();
		expect(result.body.alias).toBe('test');
	});

	it('generated alias should only contain alphanumeric characters', async () => {
		const preSend = getCreateAliasPreSend();
		const mockContext = {
			getNodeParameter: jest.fn().mockReturnValue(''),
		};

		for (let i = 0; i < 20; i++) {
			const requestOptions = { body: {} as Record<string, unknown> };
			const result = await preSend.call(mockContext, requestOptions);
			expect(result.body.alias).toMatch(/^[a-zA-Z0-9]+$/);
		}
	});

	it('generated aliases should be unique (high probability)', async () => {
		const preSend = getCreateAliasPreSend();
		const mockContext = {
			getNodeParameter: jest.fn().mockReturnValue(''),
		};
		const aliases = new Set<string>();

		for (let i = 0; i < 50; i++) {
			const requestOptions = { body: {} as Record<string, unknown> };
			const result = await preSend.call(mockContext, requestOptions);
			aliases.add(result.body.alias as string);
		}

		expect(aliases.size).toBe(50);
	});
});
