import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { transactionDescription } from '../nodes/BeehiveHub/resources/transaction';

function findProperty(props: INodeProperties[], name: string): INodeProperties | undefined {
	return props.find((p) => p.name === name);
}

describe('Payment Status & Delivery Logic', () => {
	describe('Transaction status filter', () => {
		const ALL_STATUSES = [
			'processing',
			'authorized',
			'paid',
			'refunded',
			'waiting_payment',
			'refused',
			'chargedback',
			'canceled',
			'in_protest',
			'partially_paid',
		];

		it('should document all valid transaction statuses in the status filter description', () => {
			const filters = findProperty(transactionDescription, 'filters');
			const statusFilter = (filters!.options as INodeProperties[]).find((o) => o.name === 'status');
			expect(statusFilter).toBeDefined();
			expect(statusFilter!.description).toBeDefined();

			for (const status of ALL_STATUSES) {
				expect(statusFilter!.description).toContain(status);
			}
		});

		it('should send status as a query parameter', () => {
			const filters = findProperty(transactionDescription, 'filters');
			const statusFilter = (filters!.options as INodeProperties[]).find((o) => o.name === 'status');
			expect(statusFilter!.routing?.send?.type).toBe('query');
			expect(statusFilter!.routing?.send?.property).toBe('status');
		});
	});

	describe('Delivery status', () => {
		const DELIVERY_STATUSES = ['waiting', 'in_transit', 'delivered'];

		it('should expose all valid delivery status options for update', () => {
			const deliveryStatus = findProperty(transactionDescription, 'deliveryStatusValue');
			expect(deliveryStatus).toBeDefined();
			expect(deliveryStatus!.type).toBe('options');

			const values = (deliveryStatus!.options as INodePropertyOptions[]).map((o) => o.value);
			for (const status of DELIVERY_STATUSES) {
				expect(values).toContain(status);
			}
			expect(values).toHaveLength(3);
		});

		it('should default delivery status to waiting', () => {
			const deliveryStatus = findProperty(transactionDescription, 'deliveryStatusValue');
			expect(deliveryStatus!.default).toBe('waiting');
		});

		it('should send delivery status to body as "status"', () => {
			const deliveryStatus = findProperty(transactionDescription, 'deliveryStatusValue');
			expect(deliveryStatus!.routing?.send?.type).toBe('body');
			expect(deliveryStatus!.routing?.send?.property).toBe('status');
		});

		it('should support optional tracking code with undefined fallback', () => {
			const trackingCode = findProperty(transactionDescription, 'trackingCode');
			expect(trackingCode).toBeDefined();
			expect(trackingCode!.type).toBe('string');
			expect(trackingCode!.routing?.send?.value).toBe('={{ $value || undefined }}');
		});

		it('should document delivery status values in the filter description', () => {
			const filters = findProperty(transactionDescription, 'filters');
			const deliveryFilter = (filters!.options as INodeProperties[]).find(
				(o) => o.name === 'deliveryStatus',
			);
			expect(deliveryFilter).toBeDefined();
			expect(deliveryFilter!.description).toContain('waiting');
			expect(deliveryFilter!.description).toContain('in_transit');
			expect(deliveryFilter!.description).toContain('delivered');
		});
	});

	describe('Payment method options', () => {
		const PAYMENT_METHODS = ['pix', 'boleto', 'credit_card'];

		it('should expose all payment method options for transaction creation', () => {
			const paymentMethod = findProperty(transactionDescription, 'paymentMethod');
			expect(paymentMethod).toBeDefined();
			expect(paymentMethod!.type).toBe('options');

			const values = (paymentMethod!.options as INodePropertyOptions[]).map((o) => o.value);
			for (const method of PAYMENT_METHODS) {
				expect(values).toContain(method);
			}
			expect(values).toHaveLength(3);
		});

		it('should default payment method to PIX', () => {
			const paymentMethod = findProperty(transactionDescription, 'paymentMethod');
			expect(paymentMethod!.default).toBe('pix');
		});

		it('should send payment method in body', () => {
			const paymentMethod = findProperty(transactionDescription, 'paymentMethod');
			expect(paymentMethod!.routing?.send?.type).toBe('body');
			expect(paymentMethod!.routing?.send?.property).toBe('paymentMethod');
		});
	});

	describe('Refund operation', () => {
		it('should route refund to POST with correct URL pattern', () => {
			const operation = findProperty(transactionDescription, 'operation');
			const refund = (operation!.options as INodePropertyOptions[]).find((o) => o.value === 'refund');
			expect(refund).toBeDefined();
			expect(refund!.routing!.request!.method).toBe('POST');
			expect(refund!.routing!.request!.url).toMatch(/transactions.*refund/);
		});

		it('should allow partial refund with optional amount', () => {
			const refundAmount = findProperty(transactionDescription, 'refundAmount');
			expect(refundAmount).toBeDefined();
			expect(refundAmount!.default).toBe(0);
			expect(refundAmount!.routing?.send?.value).toBe('={{ $value || undefined }}');
		});

		it('should require transactionId for refund operation', () => {
			const transactionId = findProperty(transactionDescription, 'transactionId');
			expect(transactionId).toBeDefined();
			expect(transactionId!.required).toBe(true);
			expect(transactionId!.displayOptions?.show?.operation).toContain('refund');
		});
	});
});
