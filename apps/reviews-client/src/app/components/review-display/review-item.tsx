import { Rating, Card, CardContent, Typography } from '@mui/material';

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
	review: Review;
}

// separated out to make ReviewsList cleaner
export function ReviewItem({ review }: ReviewDisplayProps) {
	return (
		<div data-testid={`review-item-${review.id}`}>
			<Card key={review.id} sx={{ marginBottom: '15px' }}>
				<CardContent>
					<Typography data-testid="user-name" variant="h5" component="div">
						{review.user.firstName} {review.user.lastName}
					</Typography>
					<Typography data-testid="date" variant="subtitle1" color="text.secondary">
						{/* reformat date */}
						{new Date(review.createdOn).toLocaleDateString('en-US', {
							year: 'numeric',
							month: 'long',
							day: 'numeric',
						})}
					</Typography>
					{/* use Material UI to change rating number to stars */}
					<Rating
						data-testid="star-rating"
						name="half-rating-read"
						value={review.rating}
						precision={0.5}
						size="small"
						readOnly
					/>
					<Typography data-testid="company-name" variant="subtitle1" color="text.secondary">
						{review.company.name}
					</Typography>
					<Typography data-testid="review-text" variant="body2">
						{review.reviewText}
					</Typography>
				</CardContent>
			</Card>
		</div>
	);
}

export default ReviewItem;
