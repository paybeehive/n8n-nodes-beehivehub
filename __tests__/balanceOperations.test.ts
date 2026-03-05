import { balanceDescription } from '../nodes/BeehiveHub/resources/balance';

const findProperty = (name: string) => balanceDescription.find((p) => p.name === name);

describe('Balance Resource', () => {
	describe('Operations', () => {
		it('should define getAvailable operation', () => {
			const op = findProperty('operation');
			const ops = (op as any).options.map((o: any) => o.value);
			expect(ops).toEqual(['getAvailable']);
		});

		it('getAvailable should GET /balance/available', () => {
			const op = findProperty('operation');
			const getAvailable = (op as any).options[0];
			expect(getAvailable.routing.request.method).toBe('GET');
			expect(getAvailable.routing.request.url).toBe('/balance/available');
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
			expect((rid!.routing as any).send.type).toBe('query');
			expect((rid!.routing as any).send.property).toBe('recipientId');
		});

		it('should send undefined when recipientId is 0', () => {
			const rid = findProperty('recipientId');
			const sendValue = (rid!.routing as any).send.value;
			expect(sendValue).toContain('undefined');
		});
	});
});
