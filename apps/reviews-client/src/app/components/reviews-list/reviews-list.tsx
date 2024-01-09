import React, { useState, useEffect, useCallback } from 'react';
import Alert from '@mui/material/Alert';
import { Typography, Pagination, CircularProgress, Box } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import ReviewItem from '../review-display/review-item';

export interface Review {
	id: number;
	reviewText: string;
	rating: number;
	createdOn: string;
	user: {
		firstName: string;
		lastName: string;
	};
	company: {
		name: string;
	};
}

export interface ReviewsListProps {
	page: number;
	limit: number;
	setPage: (page: number) => void;
}

export function ReviewsList({ page, limit, setPage }: ReviewsListProps) {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [totalReviews, setTotalReviews] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const fetchReviews = useCallback(
		(page: number) => {
			setIsLoading(true);
			Promise.all([
				fetch(`/api/reviews?page=${page}&limit=${limit}`)
					.then((response) => response.json())
					.then((data) => {
						setReviews(data.reviews);
					}),
				fetch('/api/reviews/count')
					.then((response) => response.json())
					.then((count) => {
						setTotalReviews(count.reviewsCount);
					}),
			])
				.catch((error) => {
					console.error('Error:', error);
				})
				.finally(() => {
					setIsLoading(false);
				});
		},
		[limit],
	);

	useEffect(() => {
		fetchReviews(page);
	}, [page, fetchReviews]);

	/* Allows the loading screen to show while the reviews are fetched.
	Stores current page in case of refresh or similar event. */
	const pageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
		setIsLoading(true);
		sessionStorage.setItem('page', newPage.toString());
		setPage(newPage);
		fetchReviews(newPage);
		// moves the user to the top of the page when a page is loaded.
		window.scrollTo(0, 0);
	};

	if (isLoading) {
		return (
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					height: '100vh',
				}}
			>
				<Typography variant="h2" component="div" style={{ marginBottom: '20px' }}>
					Loading
				</Typography>
				<CircularProgress />
			</div>
		);
	}

	if (!reviews || reviews.length === 0) {
		return (
			<Alert data-testid="no-reviews" severity="error" icon={<TaskIcon />}>
				No reviews available
			</Alert>
		);
	}

	return (
		<div>
			<Pagination
				data-testid="pagination"
				count={Math.ceil(Number(totalReviews) / Number(limit))}
				page={page}
				siblingCount={2}
				boundaryCount={1}
				onChange={pageChange}
			/>
			<Box sx={{ mt: 2 }}>
				{reviews.map((review: Review) => (
					<ReviewItem key={review.id} review={review} />
				))}
			</Box>
			<Pagination
				data-testid="pagination"
				count={Math.ceil(totalReviews / limit)}
				page={page}
				siblingCount={2}
				boundaryCount={1}
				onChange={pageChange}
			/>
		</div>
	);
}

export default ReviewsList;
