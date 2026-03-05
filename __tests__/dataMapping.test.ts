import { transactionDescription } from '../nodes/BeehiveHub/resources/transaction';
import { transferDescription } from '../nodes/BeehiveHub/resources/transfer';
import { paymentLinkDescription } from '../nodes/BeehiveHub/resources/paymentLink';
import { balanceDescription } from '../nodes/BeehiveHub/resources/balance';

type PropertyDef = {
	name: string;
	displayName?: string;
	type?: string;
	routing?: any;
	options?: any[];
	[key: string]: any;
};

function findProperty(props: PropertyDef[], name: string): PropertyDef | undefined {
	return props.find((p) => p.name === name);
}

function findNestedProperty(props: PropertyDef[], parentName: string, childName: string): PropertyDef | undefined {
	const parent = findProperty(props, parentName);
	if (!parent) return undefined;
	const options = parent.options as PropertyDef[] | undefined;
	if (!options) return undefined;
	for (const opt of options) {
		if (opt.name === childName) return opt;
		if (opt.values) {
			const found = (opt.values as PropertyDef[]).find((v) => v.name === childName);
			if (found) return found;
		}
		// Navigate into fixedCollection nested options
		if (opt.options) {
			for (const subOpt of opt.options as PropertyDef[]) {
				if (subOpt.name === childName) return subOpt;
				if (subOpt.values) {
					const found = (subOpt.values as PropertyDef[]).find((v) => v.name === childName);
					if (found) return found;
				}
			}
		}
	}
	return undefined;
}

describe('Data Mapping - Monetary Values', () => {
	describe('Transaction amounts', () => {
		it('should map amount field to body as cents', () => {
			const amount = findProperty(transactionDescription, 'amount');
			expect(amount).toBeDefined();
			expect(amount!.type).toBe('number');
			expect(amount!.routing?.send?.type).toBe('body');
			expect(amount!.routing?.send?.property).toBe('amount');
		});

		it('should describe amount as cents (500 = $5.00)', () => {
			const amount = findProperty(transactionDescription, 'amount');
			expect(amount!.description).toContain('cents');
		});

		it('should map item unit prices as cents', () => {
			const items = findProperty(transactionDescription, 'items');
			expect(items).toBeDefined();
			const itemOption = (items!.options as any[])?.[0];
			const unitPrice = itemOption?.values?.find((v: any) => v.name === 'unitPrice');
			expect(unitPrice).toBeDefined();
			expect(unitPrice.type).toBe('number');
			expect(unitPrice.description).toContain('cents');
		});

		it('should map refund amount to body as cents with undefined fallback', () => {
			const refundAmount = findProperty(transactionDescription, 'refundAmount');
			expect(refundAmount).toBeDefined();
			expect(refundAmount!.type).toBe('number');
			expect(refundAmount!.routing?.send?.property).toBe('amount');
			expect(refundAmount!.routing?.send?.value).toBe('={{ $value || undefined }}');
		});

		it('should map shipping fee as cents', () => {
			const shippingFields = findProperty(transactionDescription, 'shippingFields');
			const fee = (shippingFields!.options as any[])?.find((o: any) => o.name === 'fee');
			expect(fee).toBeDefined();
			expect(fee.type).toBe('number');
			expect(fee.description).toContain('cents');
			expect(fee.routing?.send?.property).toBe('shipping.fee');
		});
	});

	describe('Transfer amounts', () => {
		it('should map transfer amount to body as cents', () => {
			const amount = findProperty(transferDescription, 'amount');
			expect(amount).toBeDefined();
			expect(amount!.type).toBe('number');
			expect(amount!.required).toBe(true);
			expect(amount!.routing?.send?.type).toBe('body');
			expect(amount!.routing?.send?.property).toBe('amount');
		});

		it('should describe transfer amount as cents (1000 = $10.00)', () => {
			const amount = findProperty(transferDescription, 'amount');
			expect(amount!.description).toContain('cents');
		});
	});

	describe('Payment Link amounts', () => {
		it('should map payment link amount to body as cents', () => {
			const amount = findProperty(paymentLinkDescription, 'amount');
			expect(amount).toBeDefined();
			expect(amount!.type).toBe('number');
			expect(amount!.required).toBe(true);
			expect(amount!.routing?.send?.property).toBe('amount');
		});

		it('should describe payment link amount as cents (500 = R$ 5.00)', () => {
			const amount = findProperty(paymentLinkDescription, 'amount');
			expect(amount!.description).toContain('cents');
		});
	});

	describe('Balance routing', () => {
		it('should route balance request to GET /balance/available', () => {
			const operation = findProperty(balanceDescription, 'operation');
			const getAvailable = (operation!.options as any[])?.find(
				(o: any) => o.value === 'getAvailable',
			);
			expect(getAvailable).toBeDefined();
			expect(getAvailable.routing.request.method).toBe('GET');
			expect(getAvailable.routing.request.url).toBe('/balance/available');
		});

		it('should send recipientId as query parameter with undefined fallback', () => {
			const recipientId = findProperty(balanceDescription, 'recipientId');
			expect(recipientId).toBeDefined();
			expect(recipientId!.routing?.send?.type).toBe('query');
			expect(recipientId!.routing?.send?.property).toBe('recipientId');
			expect(recipientId!.routing?.send?.value).toBe('={{ $value || undefined }}');
		});
	});
});

describe('Data Mapping - Request Routing', () => {
	describe('Transaction operations routing', () => {
		const getOperation = () => findProperty(transactionDescription, 'operation');

		it('should route create to POST /transactions', () => {
			const op = getOperation();
			const create = (op!.options as any[])?.find((o: any) => o.value === 'create');
			expect(create.routing.request.method).toBe('POST');
			expect(create.routing.request.url).toBe('/transactions');
		});

		it('should route get to GET /transactions/{id}', () => {
			const op = getOperation();
			const get = (op!.options as any[])?.find((o: any) => o.value === 'get');
			expect(get.routing.request.method).toBe('GET');
			expect(get.routing.request.url).toContain('/transactions/');
			expect(get.routing.request.url).toContain('transactionId');
		});

		it('should route getMany to GET /transactions', () => {
			const op = getOperation();
			const getMany = (op!.options as any[])?.find((o: any) => o.value === 'getMany');
			expect(getMany.routing.request.method).toBe('GET');
			expect(getMany.routing.request.url).toBe('/transactions');
		});

		it('should route refund to POST /transactions/{id}/refund', () => {
			const op = getOperation();
			const refund = (op!.options as any[])?.find((o: any) => o.value === 'refund');
			expect(refund.routing.request.method).toBe('POST');
			expect(refund.routing.request.url).toContain('/transactions/');
			expect(refund.routing.request.url).toContain('/refund');
		});

		it('should route updateDelivery to PUT /transactions/{id}/delivery', () => {
			const op = getOperation();
			const update = (op!.options as any[])?.find((o: any) => o.value === 'updateDelivery');
			expect(update.routing.request.method).toBe('PUT');
			expect(update.routing.request.url).toContain('/delivery');
		});
	});

	describe('Customer data mapping', () => {
		it('should route customer name to customer.name in body', () => {
			const name = findProperty(transactionDescription, 'customerName');
			expect(name).toBeDefined();
			expect(name!.routing?.send?.property).toBe('customer.name');
		});

		it('should route customer email to customer.email in body', () => {
			const email = findProperty(transactionDescription, 'customerEmail');
			expect(email).toBeDefined();
			expect(email!.routing?.send?.property).toBe('customer.email');
		});

		it('should route customer document number to customer.document.number', () => {
			const docNumber = findNestedProperty(transactionDescription, 'customerFields', 'number');
			expect(docNumber).toBeDefined();
			expect(docNumber!.routing?.send?.property).toBe('customer.document.number');
		});

		it('should route customer document type to customer.document.type', () => {
			const docType = findNestedProperty(transactionDescription, 'customerFields', 'type');
			expect(docType).toBeDefined();
			expect(docType!.routing?.send?.property).toBe('customer.document.type');
		});
	});

	describe('Card data mapping', () => {
		it('should only show card fields for credit_card payment method', () => {
			const cardFields = findProperty(transactionDescription, 'cardFields');
			expect(cardFields).toBeDefined();
			expect(cardFields!.displayOptions?.show?.paymentMethod).toContain('credit_card');
		});

		it('should map card hash to card.hash in body', () => {
			const hash = findNestedProperty(transactionDescription, 'cardFields', 'hash');
			expect(hash).toBeDefined();
			expect(hash!.routing?.send?.property).toBe('card.hash');
		});

		it('should map card number to card.number in body', () => {
			const number = findNestedProperty(transactionDescription, 'cardFields', 'number');
			expect(number).toBeDefined();
			expect(number!.routing?.send?.property).toBe('card.number');
		});

		it('should map CVV to card.cvv in body', () => {
			const cvv = findNestedProperty(transactionDescription, 'cardFields', 'cvv');
			expect(cvv).toBeDefined();
			expect(cvv!.routing?.send?.property).toBe('card.cvv');
		});
	});

	describe('Transfer bank account mapping', () => {
		it('should map bank code to bankAccount.bankCode', () => {
			const bankCode = findNestedProperty(transferDescription, 'bankAccountFields', 'bankCode');
			expect(bankCode).toBeDefined();
			expect(bankCode!.routing?.send?.property).toBe('bankAccount.bankCode');
		});

		it('should map account number to bankAccount.accountNumber', () => {
			const accNum = findNestedProperty(transferDescription, 'bankAccountFields', 'accountNumber');
			expect(accNum).toBeDefined();
			expect(accNum!.routing?.send?.property).toBe('bankAccount.accountNumber');
		});

		it('should map document number to bankAccount.documentNumber', () => {
			const docNum = findNestedProperty(transferDescription, 'bankAccountFields', 'documentNumber');
			expect(docNum).toBeDefined();
			expect(docNum!.routing?.send?.property).toBe('bankAccount.documentNumber');
		});
	});
});
