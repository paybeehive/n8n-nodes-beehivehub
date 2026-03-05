import { transactionDescription } from '../nodes/BeehiveHub/resources/transaction';
import { customerDescription } from '../nodes/BeehiveHub/resources/customer';

const findTransactionProp = (name: string) =>
	transactionDescription.find((p) => p.name === name);
const findCustomerProp = (name: string) =>
	customerDescription.find((p) => p.name === name);

describe('Customer & Document Validation', () => {
	describe('Customer fields in transaction create', () => {
		it('should require customerName', () => {
			const name = findTransactionProp('customerName');
			expect(name).toBeDefined();
			expect(name!.required).toBe(true);
			expect(name!.type).toBe('string');
		});

		it('should require customerEmail', () => {
			const email = findTransactionProp('customerEmail');
			expect(email).toBeDefined();
			expect(email!.required).toBe(true);
			expect(email!.type).toBe('string');
		});

		it('should route customerName to customer.name', () => {
			const name = findTransactionProp('customerName');
			expect((name!.routing as any).send.property).toBe('customer.name');
		});

		it('should route customerEmail to customer.email', () => {
			const email = findTransactionProp('customerEmail');
			expect((email!.routing as any).send.property).toBe('customer.email');
		});
	});

	describe('Document type in transaction', () => {
		it('should support CPF and CNPJ document types', () => {
			const customerFields = findTransactionProp('customerFields');
			const docField = (customerFields as any).options.find(
				(o: any) => o.name === 'document',
			);
			expect(docField).toBeDefined();
			const docValues = docField.options[0].values;
			const typeField = docValues.find((v: any) => v.name === 'type');
			const typeOptions = typeField.options.map((o: any) => o.value);
			expect(typeOptions).toContain('cpf');
			expect(typeOptions).toContain('cnpj');
			expect(typeOptions).toHaveLength(2);
		});

		it('should default document type to cpf', () => {
			const customerFields = findTransactionProp('customerFields');
			const docField = (customerFields as any).options.find(
				(o: any) => o.name === 'document',
			);
			const docValues = docField.options[0].values;
			const typeField = docValues.find((v: any) => v.name === 'type');
			expect(typeField.default).toBe('cpf');
		});

		it('should route document number to customer.document.number', () => {
			const customerFields = findTransactionProp('customerFields');
			const docField = (customerFields as any).options.find(
				(o: any) => o.name === 'document',
			);
			const docValues = docField.options[0].values;
			const numberField = docValues.find((v: any) => v.name === 'number');
			expect(numberField.routing.send.property).toBe('customer.document.number');
		});

		it('should route document type to customer.document.type', () => {
			const customerFields = findTransactionProp('customerFields');
			const docField = (customerFields as any).options.find(
				(o: any) => o.name === 'document',
			);
			const docValues = docField.options[0].values;
			const typeField = docValues.find((v: any) => v.name === 'type');
			expect(typeField.routing.send.property).toBe('customer.document.type');
		});
	});

	describe('Customer resource', () => {
		it('should have create, get, and getMany operations', () => {
			const op = findCustomerProp('operation');
			const ops = (op as any).options.map((o: any) => o.value);
			expect(ops).toEqual(expect.arrayContaining(['create', 'get', 'getMany']));
			expect(ops).toHaveLength(3);
		});

		it('create should POST to /customers', () => {
			const op = findCustomerProp('operation');
			const create = (op as any).options.find((o: any) => o.value === 'create');
			expect(create.routing.request.method).toBe('POST');
			expect(create.routing.request.url).toBe('/customers');
		});

		it('get should GET from /customers/:id', () => {
			const op = findCustomerProp('operation');
			const get = (op as any).options.find((o: any) => o.value === 'get');
			expect(get.routing.request.method).toBe('GET');
			expect(get.routing.request.url).toContain('/customers/');
			expect(get.routing.request.url).toContain('customerId');
		});

		it('should require name for create', () => {
			const nameFields = customerDescription.filter((p) => p.name === 'name');
			const createName = nameFields.find(
				(p) => p.displayOptions?.show?.operation?.includes('create'),
			);
			expect(createName).toBeDefined();
			expect(createName!.required).toBe(true);
		});

		it('should require email for create', () => {
			const emailFields = customerDescription.filter((p) => p.name === 'email');
			const createEmail = emailFields.find(
				(p) => p.displayOptions?.show?.operation?.includes('create'),
			);
			expect(createEmail).toBeDefined();
			expect(createEmail!.required).toBe(true);
		});

		it('should support document in customer additional fields', () => {
			const additional = findCustomerProp('additionalFields');
			const docField = (additional as any).options.find(
				(o: any) => o.name === 'document',
			);
			expect(docField).toBeDefined();
			const docValues = docField.options[0].values;
			const typeField = docValues.find((v: any) => v.name === 'type');
			const types = typeField.options.map((o: any) => o.value);
			expect(types).toContain('cpf');
			expect(types).toContain('cnpj');
		});

		it('should route customer document to document.number (not customer.document.number)', () => {
			const additional = findCustomerProp('additionalFields');
			const docField = (additional as any).options.find(
				(o: any) => o.name === 'document',
			);
			const docValues = docField.options[0].values;
			const numberField = docValues.find((v: any) => v.name === 'number');
			expect(numberField.routing.send.property).toBe('document.number');
		});
	});

	describe('Customer address fields', () => {
		it('should have address collection for customer create', () => {
			const address = findCustomerProp('addressFields');
			expect(address).toBeDefined();
			expect(address!.type).toBe('collection');
			expect(address!.displayOptions?.show?.operation).toEqual(['create']);
		});

		it('should have all address fields', () => {
			const address = findCustomerProp('addressFields');
			const fieldNames = (address as any).options.map((o: any) => o.name);
			expect(fieldNames).toEqual(
				expect.arrayContaining([
					'city',
					'complement',
					'country',
					'neighborhood',
					'state',
					'street',
					'streetNumber',
					'zipCode',
				]),
			);
		});

		it('should default country to br', () => {
			const address = findCustomerProp('addressFields');
			const country = (address as any).options.find((o: any) => o.name === 'country');
			expect(country.default).toBe('br');
		});

		it('should route address fields with address. prefix', () => {
			const address = findCustomerProp('addressFields');
			(address as any).options.forEach((opt: any) => {
				expect(opt.routing.send.property).toMatch(/^address\./);
			});
		});
	});
});
