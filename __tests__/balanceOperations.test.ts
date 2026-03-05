import type { INodePropertyOptions } from 'n8n-workflow';
import { balanceDescription } from '../nodes/BeehiveHub/resources/balance';

const findProperty = (name: string) => balanceDescription.find((p) => p.name === name);

describe('Balance Resource', () => {
	describe('Operations', () => {
		it('should define getAvailable operation', () => {
			const op = findProperty('operation');
			const ops = (op!.options as INodePropertyOptions[]).map((o) => o.value);
			expect(ops).toEqual(['getAvailable']);
		});

		it('getAvailable should GET /balance/available', () => {
			const op = findProperty('operation');
			const getAvailable = (op!.options as INodePropertyOptions[])[0];
			expect(getAvailable.routing!.request!.method).toBe('GET');
			expect(getAvailable.routing!.request!.url).toBe('/balance/available');
		});
	});

	describe('Recipient ID', () => {
		it('should have optional recipientId', () => {
			const rid = findProperty('recipientId');
			expect(rid).toBeDefined();
			expect(rid!.type).toBe('number');
			expect(rid!.default).toBe(0);
		});

		it('should send recipientId as query parameter', () => {
			const rid = findProperty('recipientId');
			expect(rid!.routing!.send!.type).toBe('query');
			expect(rid!.routing!.send!.property).toBe('recipientId');
		});

		it('should send undefined when recipientId is 0', () => {
			const rid = findProperty('recipientId');
			const sendValue = rid!.routing!.send!.value;
			expect(sendValue).toContain('undefined');
		});
	});
});
