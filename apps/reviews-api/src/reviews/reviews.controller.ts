import { Controller, Get, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsCountResponse, ReviewsResponse } from './reviews.types';

@Controller('reviews')
export class ReviewsController {
	constructor(private reviewsService: ReviewsService) {}

	@Get()
	async getReviews(
		@Query('page') page: number,
		@Query('limit') limit: number,
	): Promise<ReviewsResponse> {
		try {
			const reviews = await this.reviewsService.getReviews(Number(page), Number(limit));
			return { reviews };
		} catch (error) {
			console.error(error);
		}
	}

	@Get('/count')
	async getReviewsCount(): Promise<ReviewsCountResponse> {
		const reviewsCount = await this.reviewsService.getReviewsCount();
		return { reviewsCount };
	}
}
