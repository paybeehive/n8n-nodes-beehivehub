import type { INodeProperties, INodePropertyOptions } from 'n8n-workflow';
import { transactionDescription } from '../nodes/BeehiveHub/resources/transaction';

const findProperty = (name: string) => transactionDescription.find((p) => p.name === name);

describe('Transaction Resource - Status & Delivery Logic', () => {
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

		it('should document all valid transaction statuses', () => {
			const filters = findProperty('filters');
			const statusFilter = (filters!.options as INodeProperties[]).find(
				(o) => o.name === 'status' || o.displayName === 'Status',
			);
			expect(statusFilter).toBeDefined();
			const desc = statusFilter!.description as string;
			for (const status of ALL_STATUSES) {
				expect(desc).toContain(status);
			}
		});

		it('should send status as query parameter', () => {
			const filters = findProperty('filters');
			const statusFilter = (filters!.options as INodeProperties[]).find(
				(o) => o.name === 'status' || o.displayName === 'Status',
			);
			expect(statusFilter!.routing!.send!.type).toBe('query');
			expect(statusFilter!.routing!.send!.property).toBe('status');
		});
	});

	describe('Delivery status', () => {
		const DELIVERY_STATUSES = ['waiting', 'in_transit', 'delivered'];

		it('should define all delivery status options', () => {
			const deliveryStatus = findProperty('deliveryStatusValue');
			expect(deliveryStatus).toBeDefined();
			const options = (deliveryStatus!.options as INodePropertyOptions[]).map((o) => o.value);
			expect(options).toEqual(expect.arrayContaining(DELIVERY_STATUSES));
			expect(options).toHaveLength(3);
		});

		it('should default delivery status to waiting', () => {
			const deliveryStatus = findProperty('deliveryStatusValue');
			expect(deliveryStatus!.default).toBe('waiting');
		});

		it('should require delivery status for updateDelivery', () => {
			const deliveryStatus = findProperty('deliveryStatusValue');
			expect(deliveryStatus!.required).toBe(true);
			expect(deliveryStatus!.displayOptions?.show?.operation).toEqual(['updateDelivery']);
		});

		it('should route delivery status to body as status', () => {
			const deliveryStatus = findProperty('deliveryStatusValue');
			expect(deliveryStatus!.routing!.send!.property).toBe('status');
			expect(deliveryStatus!.routing!.send!.type).toBe('body');
		});
	});

	describe('Delivery status filter in getMany', () => {
		it('should allow filtering by delivery status', () => {
			const filters = findProperty('filters');
			const deliveryFilter = (filters!.options as INodeProperties[]).find(
				(o) => o.name === 'deliveryStatus',
			);
			expect(deliveryFilter).toBeDefined();
			expect(deliveryFilter!.description).toContain('waiting');
			expect(deliveryFilter!.description).toContain('in_transit');
			expect(deliveryFilter!.description).toContain('delivered');
		});
	});

	describe('Tracking code', () => {
		it('should have tracking code field for updateDelivery', () => {
			const tracking = findProperty('trackingCode');
			expect(tracking).toBeDefined();
			expect(tracking!.type).toBe('string');
			expect(tracking!.displayOptions?.show?.operation).toEqual(['updateDelivery']);
		});

		it('should send undefined when tracking code is empty', () => {
			const tracking = findProperty('trackingCode');
			const sendValue = tracking!.routing!.send!.value;
			expect(sendValue).toContain('undefined');
		});
	});

	describe('Postback URL (webhook)', () => {
		it('should have postbackUrl in additional fields', () => {
			const additional = findProperty('additionalFields');
			const postback = (additional!.options as INodeProperties[]).find(
				(o) => o.name === 'postbackUrl',
			);
			expect(postback).toBeDefined();
			expect(postback!.type).toBe('string');
			expect(postback!.description).toContain('webhook');
		});

		it('should route postbackUrl to body', () => {
			const additional = findProperty('additionalFields');
			const postback = (additional!.options as INodeProperties[]).find(
				(o) => o.name === 'postbackUrl',
			);
			expect(postback!.routing!.send!.type).toBe('body');
			expect(postback!.routing!.send!.property).toBe('postbackUrl');
		});
	});
});
