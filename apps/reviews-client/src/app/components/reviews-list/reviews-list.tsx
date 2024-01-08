import React, { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert';
import { Typography, Pagination, CircularProgress } from '@mui/material';
import TaskIcon from '@mui/icons-material/Task';
import ReviewDisplay from '../review-display/review-display';

interface Review {
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
	reviews: Review[];
	totalReviews: number;
	page: number;
	limit: number;
	setPage: (page: number) => void;
	fetchReviews: (page: number) => void;
}

export function ReviewsList({
	reviews,
	totalReviews,
	page,
	limit,
	setPage,
	fetchReviews,
}: ReviewsListProps) {
	const [isLoading, setIsLoading] = useState(false);

	const pageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
		setIsLoading(true);
		sessionStorage.setItem('page', newPage.toString());
		setPage(newPage);
		fetchReviews(newPage);
	};

	useEffect(() => {
		setIsLoading(true);
		fetchReviews(page);
	}, [page, fetchReviews]);

	useEffect(() => {
		if (reviews.length > 0) {
			setIsLoading(false);
		}
	}, [reviews]);

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
			<Alert severity="error" icon={<TaskIcon />}>
				No reviews available
			</Alert>
		);
	}

	return (
		<div>
			<Pagination
				count={Math.ceil(totalReviews / limit)}
				defaultPage={page}
				page={page}
				siblingCount={0}
				boundaryCount={2}
				onChange={pageChange}
			/>
			<ReviewDisplay reviews={reviews} />
			<Pagination
				count={Math.ceil(totalReviews / limit)}
				defaultPage={page}
				page={page}
				siblingCount={0}
				boundaryCount={2}
				onChange={pageChange}
			/>
		</div>
	);
}

export default ReviewsList;
