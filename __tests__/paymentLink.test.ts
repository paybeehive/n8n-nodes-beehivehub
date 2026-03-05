import type { INodePropertyOptions } from 'n8n-workflow';
import { paymentLinkDescription } from '../nodes/BeehiveHub/resources/paymentLink';

const findProperty = (name: string) => paymentLinkDescription.find((p) => p.name === name);
const getOperationOptions = () => {
	const op = findProperty('operation');
	return op!.options as INodePropertyOptions[];
};

describe('Payment Link Resource', () => {
	describe('Operations', () => {
		it('should define create, delete, get, getMany, and update', () => {
			const ops = getOperationOptions().map((o) => o.value);
			expect(ops).toEqual(
				expect.arrayContaining(['create', 'delete', 'get', 'getMany', 'update']),
			);
			expect(ops).toHaveLength(5);
		});

		it('should default to getMany', () => {
			const op = findProperty('operation');
			expect(op!.default).toBe('getMany');
		});

		it('create should POST to /payment-links', () => {
			const create = getOperationOptions().find((o) => o.value === 'create');
			expect(create!.routing!.request!.method).toBe('POST');
			expect(create!.routing!.request!.url).toBe('/payment-links');
		});

		it('delete should DELETE /payment-links/:id', () => {
			const del = getOperationOptions().find((o) => o.value === 'delete');
			expect(del!.routing!.request!.method).toBe('DELETE');
			expect(del!.routing!.request!.url).toContain('/payment-links/');
		});

		it('update should PUT /payment-links/:id', () => {
			const update = getOperationOptions().find((o) => o.value === 'update');
			expect(update!.routing!.request!.method).toBe('PUT');
			expect(update!.routing!.request!.url).toContain('/payment-links/');
		});
	});

	describe('Amount field', () => {
		it('should have amount in cents', () => {
			const amount = findProperty('amount');
			expect(amount).toBeDefined();
			expect(amount!.type).toBe('number');
			expect(amount!.displayName).toBe('Amount (Cents)');
			expect(amount!.required).toBe(true);
		});

		it('should describe amount as R$ (500 = R$ 5.00)', () => {
			const amount = findProperty('amount');
			expect(amount!.description).toContain('R$');
		});

		it('should show amount for create and update', () => {
			const amount = findProperty('amount');
			expect(amount!.displayOptions?.show?.operation).toEqual(
				expect.arrayContaining(['create', 'update']),
			);
		});
	});

	describe('Payment link ID', () => {
		it('should be required for get, delete, and update', () => {
			const id = findProperty('paymentLinkId');
			expect(id).toBeDefined();
			expect(id!.required).toBe(true);
			expect(id!.displayOptions?.show?.operation).toEqual(
				expect.arrayContaining(['get', 'delete', 'update']),
			);
		});
	});

	describe('Alias (unique identifier)', () => {
		it('should have alias field for create with auto-generate option', () => {
			const aliasFields = paymentLinkDescription.filter((p) => p.name === 'alias');
			const createAlias = aliasFields.find(
				(p) => p.displayOptions?.show?.operation?.includes('create'),
			);
			expect(createAlias).toBeDefined();
			expect(createAlias!.placeholder).toContain('auto-generate');
		});

		it('should require alias for update', () => {
			const aliasFields = paymentLinkDescription.filter((p) => p.name === 'alias');
			const updateAlias = aliasFields.find(
				(p) => p.displayOptions?.show?.operation?.includes('update'),
			);
			expect(updateAlias).toBeDefined();
			expect(updateAlias!.required).toBe(true);
		});

		it('create alias should have preSend handler', () => {
			const aliasFields = paymentLinkDescription.filter((p) => p.name === 'alias');
			const createAlias = aliasFields.find(
				(p) => p.displayOptions?.show?.operation?.includes('create'),
			);
			const preSend = createAlias!.routing!.send!.preSend;
			expect(preSend).toBeDefined();
			expect(preSend).toHaveLength(1);
			expect(typeof preSend![0]).toBe('function');
		});
	});

	describe('Payment settings', () => {
		it('should have default payment method with pix, boleto, credit_card', () => {
			const pm = findProperty('defaultPaymentMethod');
			expect(pm).toBeDefined();
			const options = (pm!.options as INodePropertyOptions[]).map((o) => o.value);
			expect(options).toContain('pix');
			expect(options).toContain('boleto');
			expect(options).toContain('credit_card');
		});

		it('should default to pix', () => {
			const pm = findProperty('defaultPaymentMethod');
			expect(pm!.default).toBe('pix');
		});

		it('should route settings to body with settings. prefix', () => {
			const pm = findProperty('defaultPaymentMethod');
			expect(pm!.routing!.send!.property).toBe('settings.defaultPaymentMethod');
		});
	});

	describe('Card settings', () => {
		it('should have cardEnabled toggle', () => {
			const card = findProperty('cardEnabled');
			expect(card).toBeDefined();
			expect(card!.type).toBe('boolean');
			expect(card!.default).toBe(true);
		});

		it('should have card free installments', () => {
			const free = findProperty('cardFreeInstallments');
			expect(free).toBeDefined();
			expect(free!.type).toBe('number');
			expect(free!.default).toBe(1);
		});

		it('should have card max installments defaulting to 12', () => {
			const max = findProperty('cardMaxInstallments');
			expect(max).toBeDefined();
			expect(max!.default).toBe(12);
		});
	});

	describe('PIX settings', () => {
		it('should have pixEnabled toggle', () => {
			const pix = findProperty('pixEnabled');
			expect(pix).toBeDefined();
			expect(pix!.type).toBe('boolean');
			expect(pix!.default).toBe(true);
		});

		it('should have PIX expiration in days', () => {
			const exp = findProperty('pixExpiresInDays');
			expect(exp).toBeDefined();
			expect(exp!.type).toBe('number');
			expect(exp!.default).toBe(2);
		});
	});

	describe('Boleto settings', () => {
		it('should have boletoEnabled toggle', () => {
			const boleto = findProperty('boletoEnabled');
			expect(boleto).toBeDefined();
			expect(boleto!.type).toBe('boolean');
			expect(boleto!.default).toBe(true);
		});

		it('should have boleto expiration in days', () => {
			const exp = findProperty('boletoExpiresInDays');
			expect(exp).toBeDefined();
			expect(exp!.type).toBe('number');
			expect(exp!.default).toBe(2);
		});
	});

	describe('Customer data request settings', () => {
		it('should have requestAddress toggle defaulting to true', () => {
			const addr = findProperty('requestAddress');
			expect(addr).toBeDefined();
			expect(addr!.default).toBe(true);
		});

		it('should have requestPhone toggle defaulting to true', () => {
			const phone = findProperty('requestPhone');
			expect(phone).toBeDefined();
			expect(phone!.default).toBe(true);
		});

		it('should have requestDocument toggle defaulting to true', () => {
			const doc = findProperty('requestDocument');
			expect(doc).toBeDefined();
			expect(doc!.default).toBe(true);
		});
	});
});
