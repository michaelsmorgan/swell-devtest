import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ReviewsService {
	constructor(private prisma: DatabaseService) {}

	getReviewsCount() {
		return this.prisma.review.count();
	}

	getReviews(page: number, limit: number) {
		const reviews = this.prisma.review.findMany({
			skip: (page - 1) * limit,
			take: limit,
			include: { user: true, company: true },
			orderBy: {
				createdOn: 'desc',
			},
		});
		return reviews;
	}
}
