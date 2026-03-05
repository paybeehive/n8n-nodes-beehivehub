import { transactionDescription } from '../nodes/BeehiveHub/resources/transaction';

const findProperty = (name: string) => transactionDescription.find((p) => p.name === name);
const getOperationOptions = () => {
	const op = findProperty('operation');
	return (op as any).options as Array<{ name: string; value: string; routing: any }>;
};

describe('Transaction Resource - Operations & Routing', () => {
	describe('Operations', () => {
		it('should define create, get, getMany, refund, and updateDelivery', () => {
			const ops = getOperationOptions().map((o) => o.value);
			expect(ops).toEqual(
				expect.arrayContaining(['create', 'get', 'getMany', 'refund', 'updateDelivery']),
			);
			expect(ops).toHaveLength(5);
		});

		it('should default to create operation', () => {
			const op = findProperty('operation');
			expect(op!.default).toBe('create');
		});
	});

	describe('HTTP routing', () => {
		it('create should POST to /transactions', () => {
			const create = getOperationOptions().find((o) => o.value === 'create');
			expect(create!.routing.request.method).toBe('POST');
			expect(create!.routing.request.url).toBe('/transactions');
		});

		it('get should GET from /transactions/:id', () => {
			const get = getOperationOptions().find((o) => o.value === 'get');
			expect(get!.routing.request.method).toBe('GET');
			expect(get!.routing.request.url).toContain('/transactions/');
			expect(get!.routing.request.url).toContain('transactionId');
		});

		it('getMany should GET from /transactions', () => {
			const getMany = getOperationOptions().find((o) => o.value === 'getMany');
			expect(getMany!.routing.request.method).toBe('GET');
			expect(getMany!.routing.request.url).toBe('/transactions');
		});

		it('refund should POST to /transactions/:id/refund', () => {
			const refund = getOperationOptions().find((o) => o.value === 'refund');
			expect(refund!.routing.request.method).toBe('POST');
			expect(refund!.routing.request.url).toContain('/transactions/');
			expect(refund!.routing.request.url).toContain('/refund');
		});

		it('updateDelivery should PUT to /transactions/:id/delivery', () => {
			const update = getOperationOptions().find((o) => o.value === 'updateDelivery');
			expect(update!.routing.request.method).toBe('PUT');
			expect(update!.routing.request.url).toContain('/delivery');
		});
	});

	describe('Amount field (monetary values)', () => {
		it('should have amount field in cents', () => {
			const amount = findProperty('amount');
			expect(amount).toBeDefined();
			expect(amount!.type).toBe('number');
			expect(amount!.displayName).toBe('Amount (Cents)');
		});

		it('should describe amount format (500 = $5.00)', () => {
			const amount = findProperty('amount');
			expect(amount!.description).toContain('cents');
			expect(amount!.description).toContain('500');
		});

		it('should default amount to 0', () => {
			const amount = findProperty('amount');
			expect(amount!.default).toBe(0);
		});

		it('should require amount for create', () => {
			const amount = findProperty('amount');
			expect(amount!.required).toBe(true);
		});

		it('should route amount to body', () => {
			const amount = findProperty('amount');
			expect((amount!.routing as any).send.type).toBe('body');
			expect((amount!.routing as any).send.property).toBe('amount');
		});
	});

	describe('Refund amount', () => {
		it('should have refundAmount field in cents', () => {
			const refund = findProperty('refundAmount');
			expect(refund).toBeDefined();
			expect(refund!.type).toBe('number');
			expect(refund!.displayName).toBe('Refund Amount (Cents)');
		});

		it('should default refundAmount to 0 (full refund)', () => {
			const refund = findProperty('refundAmount');
			expect(refund!.default).toBe(0);
		});

		it('should send undefined when refundAmount is 0 (full refund)', () => {
			const refund = findProperty('refundAmount');
			const sendValue = (refund!.routing as any).send.value;
			expect(sendValue).toContain('undefined');
		});

		it('should only show for refund operation', () => {
			const refund = findProperty('refundAmount');
			expect(refund!.displayOptions?.show?.operation).toEqual(['refund']);
		});
	});

	describe('Payment methods', () => {
		it('should support pix, boleto, and credit_card', () => {
			const pm = findProperty('paymentMethod');
			const options = (pm as any).options.map((o: any) => o.value);
			expect(options).toContain('pix');
			expect(options).toContain('boleto');
			expect(options).toContain('credit_card');
			expect(options).toHaveLength(3);
		});

		it('should default to pix', () => {
			const pm = findProperty('paymentMethod');
			expect(pm!.default).toBe('pix');
		});

		it('should require payment method', () => {
			const pm = findProperty('paymentMethod');
			expect(pm!.required).toBe(true);
		});
	});

	describe('Transaction ID field', () => {
		it('should be required for get, refund, and updateDelivery', () => {
			const tid = findProperty('transactionId');
			expect(tid!.required).toBe(true);
			expect(tid!.displayOptions?.show?.operation).toEqual(
				expect.arrayContaining(['get', 'refund', 'updateDelivery']),
			);
		});

		it('should not be visible for create or getMany', () => {
			const tid = findProperty('transactionId');
			const visibleOps = tid!.displayOptions?.show?.operation as string[];
			expect(visibleOps).not.toContain('create');
			expect(visibleOps).not.toContain('getMany');
		});
	});

	describe('Installments', () => {
		it('should have min 1 and max 12', () => {
			const inst = findProperty('installments');
			expect(inst).toBeDefined();
			expect(inst!.typeOptions?.minValue).toBe(1);
			expect(inst!.typeOptions?.maxValue).toBe(12);
		});

		it('should only show for credit_card payment', () => {
			const inst = findProperty('installments');
			expect(inst!.displayOptions?.show?.paymentMethod).toEqual(['credit_card']);
		});
	});

	describe('Card fields', () => {
		it('should only show for credit_card payment', () => {
			const card = findProperty('cardFields');
			expect(card!.displayOptions?.show?.paymentMethod).toEqual(['credit_card']);
		});

		it('should have card data fields (number, cvv, holder, expiration)', () => {
			const card = findProperty('cardFields');
			const fieldNames = (card as any).options.map((o: any) => o.name);
			expect(fieldNames).toEqual(
				expect.arrayContaining([
					'number',
					'cvv',
					'holderName',
					'expirationMonth',
					'expirationYear',
				]),
			);
		});

		it('should route card fields to body with card. prefix', () => {
			const card = findProperty('cardFields');
			(card as any).options.forEach((opt: any) => {
				expect(opt.routing.send.property).toMatch(/^card\./);
			});
		});
	});
});
