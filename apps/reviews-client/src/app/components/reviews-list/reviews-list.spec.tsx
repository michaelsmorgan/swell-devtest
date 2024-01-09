import { render, screen, within, fireEvent, waitFor, act } from '@testing-library/react';
import ReviewsList from './reviews-list';

describe('ReviewsList', () => {
	afterEach(() => {
		(fetch as jest.Mock).mockReset();
	});

	it('should render successfully', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews: [], reviewsCount: 0 }),
			}),
		) as jest.Mock;

		await act(async () => {
			const { baseElement } = render(<ReviewsList page={1} limit={10} setPage={() => {}} />);
			expect(baseElement).toBeTruthy();
		});
	});

	it('should render list of reviews', async () => {
		const reviews = [
			{
				id: 1,
				reviewText: 'Pretty good.',
				rating: 5,
				createdOn: '2021-01-29T22:19:46Z',
				user: { firstName: 'John', lastName: 'Doe' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 2,
				reviewText: 'They do alright.',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Doe' },
				company: { name: 'Test Company 2' },
			},
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews, reviewsCount: reviews.length }),
			}),
		) as jest.Mock;

		await act(async () => {
			render(<ReviewsList page={1} limit={10} setPage={() => {}} />);
		});

		for (const rev of reviews) {
			const reviewItem = await screen.findByTestId(`review-item-${rev.id}`);
			expect(reviewItem).toBeInTheDocument();
		}
	});

	it('should display message if no reviews are found', async () => {
		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews: [], reviewsCount: 0 }),
			}),
		) as jest.Mock;

		await act(async () => {
			render(<ReviewsList page={1} limit={10} setPage={() => {}} />);
		});

		const noReviewsMessage = await screen.findByText('No reviews available');
		expect(noReviewsMessage).toBeInTheDocument();
	});

	it('should display the review text if provided', async () => {
		const reviews = [
			{
				id: 1,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 2,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
		];

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews, reviewsCount: reviews.length }),
			}),
		) as jest.Mock;

		await act(async () => {
			render(<ReviewsList page={1} limit={10} setPage={() => {}} />);
		});

		const reviewItem = await screen.findByTestId('review-item-2');

		// Find the review text within the review item
		const reviewText = within(reviewItem).getByText('Really great products!');
		expect(reviewText).toBeInTheDocument();
	});

	it('should display loading when fetching reviews', async () => {
		// Mock the global fetch function
		global.fetch = jest.fn(
			() =>
				new Promise((resolve) => {
					setTimeout(() => {
						resolve({
							json: () => Promise.resolve({ reviews: [], reviewsCount: 0 }),
						});
					}, 1000);
				}),
		) as jest.Mock;

		await act(async () => {
			render(<ReviewsList page={1} limit={10} setPage={() => {}} />);
		});

		// Check if 'Loading' text and progress bar are in the document
		expect(screen.getByText('Loading')).toBeInTheDocument();
		expect(screen.getByRole('progressbar')).toBeInTheDocument();

		// Wait for fetch to resolve and check if 'Loading' text and progress bar have been removed
		await screen.findByTestId('no-reviews');
		expect(screen.queryByText('Loading')).not.toBeInTheDocument();
		expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
	});

	it('should render Pagination component with correct page count', async () => {
		// Mock window.scrollTo
		window.scrollTo = jest.fn();

		const reviews = [
			{
				id: 1,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 2,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 3,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 4,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 5,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 6,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 7,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 8,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 9,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 10,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
		];
		const totalReviews = 10;
		const limit = 2;
		const setPage = jest.fn();

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews: reviews, reviewsCount: totalReviews }),
			}),
		) as jest.Mock;

		await act(async () => {
			render(<ReviewsList page={1} limit={limit} setPage={setPage} />);
		});

		// Wait for fetch to resolve and reviews to be set
		await waitFor(() => expect(screen.queryByTestId('no-reviews')).not.toBeInTheDocument());

		// Find the Pagination components by their test id
		const pagination = await screen.findAllByTestId('pagination');
		expect(pagination).toHaveLength(2); // top and bottom pagination

		const pageCount = Math.ceil(totalReviews / limit);
		pagination.forEach((paginationComponent) => {
			expect(within(paginationComponent).getByText(pageCount.toString())).toBeInTheDocument();
		});
	});

	it('should call setPage with new page number on page change', async () => {
		// Mock window.scrollTo
		window.scrollTo = jest.fn();

		const reviews = [
			{
				id: 1,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 2,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 3,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 4,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 5,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 6,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 7,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 8,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
			{
				id: 9,
				reviewText: 'Meh',
				rating: 5,
				createdOn: '2020-10-25T20:25:12Z',
				user: { firstName: 'Adam', lastName: 'Smith' },
				company: { name: 'Test Company 1' },
			},
			{
				id: 10,
				reviewText: 'Really great products!',
				rating: 4,
				createdOn: '2023-05-10T09:05:35Z',
				user: { firstName: 'Jane', lastName: 'Smith' },
				company: { name: 'Test Company 2' },
			},
		];
		const totalReviews = 10;
		const limit = 2;
		const setPage = jest.fn();

		global.fetch = jest.fn(() =>
			Promise.resolve({
				json: () => Promise.resolve({ reviews: reviews, reviewsCount: totalReviews }),
			}),
		) as jest.Mock;

		await act(async () => {
			render(<ReviewsList page={1} limit={limit} setPage={setPage} />);
		});

		// Wait for fetch to resolve and reviews to be set
		await waitFor(() => expect(screen.queryByTestId('no-reviews')).not.toBeInTheDocument());

		// Find the Pagination components by their test id
		const pagination = await screen.findAllByTestId('pagination');

		// Simulate a page change event
		await act(async () => {
			fireEvent.click(within(pagination[0]).getByText('2'));
		});

		// Check if setPage was called with the new page number
		expect(setPage).toHaveBeenCalledWith(2);
	});
});
