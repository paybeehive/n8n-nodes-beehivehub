import { transactionDescription } from '../nodes/BeehiveHub/resources/transaction';

const findProperty = (name: string) => transactionDescription.find((p) => p.name === name);

describe('Transaction Items', () => {
	describe('Items field structure', () => {
		it('should have items as fixedCollection with multipleValues', () => {
			const items = findProperty('items');
			expect(items).toBeDefined();
			expect(items!.type).toBe('fixedCollection');
			expect(items!.typeOptions?.multipleValues).toBe(true);
		});

		it('should only show for create operation', () => {
			const items = findProperty('items');
			expect(items!.displayOptions?.show?.operation).toEqual(['create']);
		});

		it('should route items to body', () => {
			const items = findProperty('items');
			expect((items!.routing as any).send.type).toBe('body');
			expect((items!.routing as any).send.property).toBe('items');
		});
	});

	describe('Item fields', () => {
		const getItemValues = () => {
			const items = findProperty('items');
			return (items as any).options[0].values;
		};

		it('should have title field', () => {
			const values = getItemValues();
			const title = values.find((v: any) => v.name === 'title');
			expect(title).toBeDefined();
			expect(title.type).toBe('string');
		});

		it('should have unitPrice in cents', () => {
			const values = getItemValues();
			const price = values.find((v: any) => v.name === 'unitPrice');
			expect(price).toBeDefined();
			expect(price.type).toBe('number');
			expect(price.displayName).toBe('Unit Price (Cents)');
		});

		it('should have quantity field defaulting to 1', () => {
			const values = getItemValues();
			const qty = values.find((v: any) => v.name === 'quantity');
			expect(qty).toBeDefined();
			expect(qty.default).toBe(1);
		});

		it('should have tangible boolean defaulting to true', () => {
			const values = getItemValues();
			const tangible = values.find((v: any) => v.name === 'tangible');
			expect(tangible).toBeDefined();
			expect(tangible.type).toBe('boolean');
			expect(tangible.default).toBe(true);
		});

		it('should have additionalFields with externalRef', () => {
			const values = getItemValues();
			const additional = values.find((v: any) => v.name === 'additionalFields');
			expect(additional).toBeDefined();
			const extRef = additional.options.find((o: any) => o.name === 'externalRef');
			expect(extRef).toBeDefined();
		});
	});

	describe('Shipping fields', () => {
		it('should have shipping collection for create', () => {
			const shipping = findProperty('shippingFields');
			expect(shipping).toBeDefined();
			expect(shipping!.type).toBe('collection');
			expect(shipping!.displayOptions?.show?.operation).toEqual(['create']);
		});

		it('should have shipping fee in cents', () => {
			const shipping = findProperty('shippingFields');
			const fee = (shipping as any).options.find((o: any) => o.name === 'fee');
			expect(fee).toBeDefined();
			expect(fee.displayName).toBe('Fee (Cents)');
			expect(fee.type).toBe('number');
		});

		it('should route shipping fields with shipping. prefix', () => {
			const shipping = findProperty('shippingFields');
			(shipping as any).options.forEach((opt: any) => {
				expect(opt.routing.send.property).toMatch(/^shipping\./);
			});
		});

		it('should default shipping country to br', () => {
			const shipping = findProperty('shippingFields');
			const country = (shipping as any).options.find((o: any) => o.name === 'country');
			expect(country.default).toBe('br');
		});
	});

	describe('Transaction additional fields', () => {
		it('should have boleto expiration in days', () => {
			const additional = findProperty('additionalFields');
			const boleto = (additional as any).options.find(
				(o: any) => o.name === 'boletoExpiresInDays',
			);
			expect(boleto).toBeDefined();
			expect(boleto.type).toBe('number');
			expect(boleto.default).toBe(3);
			expect(boleto.routing.send.property).toBe('boleto.expiresInDays');
		});

		it('should have PIX expiration in minutes', () => {
			const additional = findProperty('additionalFields');
			const pix = (additional as any).options.find(
				(o: any) => o.name === 'pixExpiresInMinutes',
			);
			expect(pix).toBeDefined();
			expect(pix.type).toBe('number');
			expect(pix.default).toBe(60);
			expect(pix.routing.send.property).toBe('pix.expiresInMinutes');
		});

		it('should have traceable toggle', () => {
			const additional = findProperty('additionalFields');
			const traceable = (additional as any).options.find(
				(o: any) => o.name === 'traceable',
			);
			expect(traceable).toBeDefined();
			expect(traceable.type).toBe('boolean');
			expect(traceable.default).toBe(false);
		});

		it('should have metadata field', () => {
			const additional = findProperty('additionalFields');
			const metadata = (additional as any).options.find(
				(o: any) => o.name === 'metadata',
			);
			expect(metadata).toBeDefined();
			expect(metadata.type).toBe('string');
		});

		it('should have customer IP field', () => {
			const additional = findProperty('additionalFields');
			const ip = (additional as any).options.find((o: any) => o.name === 'ip');
			expect(ip).toBeDefined();
			expect(ip.type).toBe('string');
		});
	});

	describe('Filters for getMany', () => {
		it('should have filters collection for getMany', () => {
			const filters = findProperty('filters');
			expect(filters).toBeDefined();
			expect(filters!.type).toBe('collection');
			expect(filters!.displayOptions?.show?.operation).toEqual(['getMany']);
		});

		it('should support all expected filter types', () => {
			const filters = findProperty('filters');
			const filterNames = (filters as any).options.map((o: any) => o.name);
			expect(filterNames).toEqual(
				expect.arrayContaining([
					'email',
					'name',
					'deliveryStatus',
					'documentNumber',
					'installments',
					'paymentMethods',
					'phone',
					'status',
					'traceable',
					'id',
				]),
			);
		});

		it('should route all filters as query parameters', () => {
			const filters = findProperty('filters');
			(filters as any).options.forEach((opt: any) => {
				expect(opt.routing.send.type).toBe('query');
			});
		});
	});
});
