import React from 'react';
import { Rating, Card, CardContent, Typography, Box } from '@mui/material';

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

interface ReviewDisplayProps {
	reviews: Review[];
}

export function ReviewDisplay({ reviews }: ReviewDisplayProps) {
	return (
		<Box sx={{ mt: 2 }}>
			{reviews.map((review: Review) => (
				<Card key={review.id} sx={{ marginBottom: '15px' }}>
					<CardContent>
						<Typography variant="h5" component="div">
							{review.user.firstName} {review.user.lastName}
						</Typography>
						<Typography variant="subtitle1" color="text.secondary">
							{new Date(review.createdOn).toLocaleDateString('en-US', {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							})}
						</Typography>
						<Rating
							name="half-rating-read"
							value={review.rating}
							precision={0.5}
							size="small"
							readOnly
						/>
						<Typography variant="subtitle1" color="text.secondary">
							{review.company.name}
						</Typography>
						<Typography variant="body2">{review.reviewText}</Typography>
					</CardContent>
				</Card>
			))}
		</Box>
	);
}

export default ReviewDisplay;
