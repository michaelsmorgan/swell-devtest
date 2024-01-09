import { render, act } from '@testing-library/react';
import App from './app';

describe('App', () => {
	it('should render successfully', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews: [], reviewsCount: 0 }),
			}),
		) as jest.Mock;

		await act(async () => {
			const { baseElement } = render(<App />);
			expect(baseElement).toBeTruthy();
		});
	});
});
