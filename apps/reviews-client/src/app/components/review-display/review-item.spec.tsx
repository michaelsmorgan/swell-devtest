import { render, screen } from '@testing-library/react';
import ReviewItem from '../review-display/review-item';

describe('ReviewItem', () => {
	const mockReview = {
		id: 1,
		reviewText: 'Great product!',
		rating: 4.5,
		createdOn: '2024-01-08T00:00:00.000Z',
		user: {
			firstName: 'John',
			lastName: 'Doe',
		},
		company: {
			name: 'Test Company',
		},
	};

	beforeEach(() => {
		render(<ReviewItem review={mockReview} />);
	});

	it('renders user name', () => {
		const userNameElement = screen.getByTestId('user-name');
		expect(userNameElement).toBeInTheDocument();
	});

	it('renders the correct date', () => {
		const dateElement = screen.getByTestId('date');
		expect(dateElement).toBeInTheDocument();
	});

	it('renders the correct review score', () => {
		const scoreElement = screen.getByTestId('star-rating');
		expect(scoreElement).toBeInTheDocument();
	});

	it('renders company name', () => {
		const companyNameElement = screen.getByTestId('company-name');
		expect(companyNameElement).toBeInTheDocument();
	});

	it('renders review text', () => {
		const reviewTextElement = screen.getByTestId('review-text');
		expect(reviewTextElement).toBeInTheDocument();
	});
});
