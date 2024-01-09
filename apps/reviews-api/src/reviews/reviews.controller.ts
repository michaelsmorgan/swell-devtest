import { Controller, Get, Query, HttpException, HttpStatus } from '@nestjs/common';
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
		// if the number of reviews requested is 0 or less, throw an exception
		if (limit < 1) {
			throw new HttpException('Invalid limit value: ' + limit, HttpStatus.BAD_REQUEST);
		}
		if (page < 1) {
			throw new HttpException('Invalid page number: ' + page, HttpStatus.BAD_REQUEST);
		}
		try {
			const reviews = await this.reviewsService.getReviews(Number(page), Number(limit));
			return { reviews };
		} catch (error) {
			throw new HttpException('Error fetching reviews', HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	@Get('/count')
	async getReviewsCount(): Promise<ReviewsCountResponse> {
		const reviewsCount = await this.reviewsService.getReviewsCount();
		return { reviewsCount };
	}
}
