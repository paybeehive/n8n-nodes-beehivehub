import { transferDescription } from '../nodes/BeehiveHub/resources/transfer';

const findProperty = (name: string) => transferDescription.find((p) => p.name === name);

describe('Transfer Resource', () => {
	describe('Operations', () => {
		it('should define create and get operations', () => {
			const op = findProperty('operation');
			const ops = (op as any).options.map((o: any) => o.value);
			expect(ops).toEqual(['create', 'get']);
		});

		it('create should POST to /transfers', () => {
			const op = findProperty('operation');
			const create = (op as any).options.find((o: any) => o.value === 'create');
			expect(create.routing.request.method).toBe('POST');
			expect(create.routing.request.url).toBe('/transfers');
		});

		it('get should GET from /transfers/:id', () => {
			const op = findProperty('operation');
			const get = (op as any).options.find((o: any) => o.value === 'get');
			expect(get.routing.request.method).toBe('GET');
			expect(get.routing.request.url).toContain('/transfers/');
		});
	});

	describe('Transfer amount', () => {
		it('should have amount field in cents', () => {
			const amount = findProperty('amount');
			expect(amount).toBeDefined();
			expect(amount!.type).toBe('number');
			expect(amount!.displayName).toBe('Amount (Cents)');
			expect(amount!.required).toBe(true);
		});

		it('should describe amount format (1000 = $10.00)', () => {
			const amount = findProperty('amount');
			expect(amount!.description).toContain('cents');
			expect(amount!.description).toContain('1000');
		});

		it('should default amount to 0', () => {
			const amount = findProperty('amount');
			expect(amount!.default).toBe(0);
		});
	});

	describe('Transfer ID', () => {
		it('should require transferId for get operation', () => {
			const tid = findProperty('transferId');
			expect(tid).toBeDefined();
			expect(tid!.required).toBe(true);
			expect(tid!.displayOptions?.show?.operation).toEqual(['get']);
		});
	});

	describe('Bank account fields', () => {
		it('should have bank account collection', () => {
			const bank = findProperty('bankAccountFields');
			expect(bank).toBeDefined();
			expect(bank!.type).toBe('collection');
		});

		it('should support checking and savings account types', () => {
			const bank = findProperty('bankAccountFields');
			const typeField = (bank as any).options.find((o: any) => o.name === 'type');
			const types = typeField.options.map((o: any) => o.value);
			expect(types).toContain('conta_corrente');
			expect(types).toContain('conta_poupanca');
		});

		it('should default account type to conta_corrente', () => {
			const bank = findProperty('bankAccountFields');
			const typeField = (bank as any).options.find((o: any) => o.name === 'type');
			expect(typeField.default).toBe('conta_corrente');
		});

		it('should have all required bank fields', () => {
			const bank = findProperty('bankAccountFields');
			const fieldNames = (bank as any).options.map((o: any) => o.name);
			expect(fieldNames).toEqual(
				expect.arrayContaining([
					'accountDigit',
					'accountNumber',
					'type',
					'agencyNumber',
					'bankCode',
					'documentNumber',
					'documentType',
					'legalName',
				]),
			);
		});

		it('should route bank fields to body with bankAccount. prefix', () => {
			const bank = findProperty('bankAccountFields');
			(bank as any).options.forEach((opt: any) => {
				expect(opt.routing.send.property).toMatch(/^bankAccount\./);
			});
		});

		it('should support CPF and CNPJ for bank account document', () => {
			const bank = findProperty('bankAccountFields');
			const docType = (bank as any).options.find((o: any) => o.name === 'documentType');
			const types = docType.options.map((o: any) => o.value);
			expect(types).toContain('cpf');
			expect(types).toContain('cnpj');
		});
	});

	describe('Transfer additional fields', () => {
		it('should have postbackUrl for webhook notifications', () => {
			const additional = findProperty('additionalFields');
			const postback = (additional as any).options.find(
				(o: any) => o.name === 'postbackUrl',
			);
			expect(postback).toBeDefined();
			expect(postback.description).toContain('webhook');
		});

		it('should have pixKey field', () => {
			const additional = findProperty('additionalFields');
			const pixKey = (additional as any).options.find((o: any) => o.name === 'pixKey');
			expect(pixKey).toBeDefined();
			expect(pixKey.type).toBe('string');
		});

		it('should send undefined for empty optional fields', () => {
			const additional = findProperty('additionalFields');
			const optionalFields = ['recipientId', 'pixKey', 'postbackUrl', 'externalRef'];
			for (const fieldName of optionalFields) {
				const field = (additional as any).options.find(
					(o: any) => o.name === fieldName,
				);
				expect(field.routing.send.value).toContain('undefined');
			}
		});
	});
});
