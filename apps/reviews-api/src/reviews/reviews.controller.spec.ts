import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { DatabaseModule } from '../database/database.module';
import { DatabaseService } from '../database/database.service';
import { ReviewsController } from './reviews.controller';
import { ReviewsService } from './reviews.service';

describe('ReviewsController', () => {
	const user1Id = 'user-1';
	const user2Id = 'user-2';
	const company1Id = 'company-1';
	const company2Id = 'company-2';

	let app: INestApplication;
	let prisma: DatabaseService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			imports: [DatabaseModule],
			controllers: [ReviewsController],
			providers: [ReviewsService],
		}).compile();

		app = module.createNestApplication();
		prisma = module.get<DatabaseService>(DatabaseService);
		await app.init();

		await prisma.$transaction([
			prisma.user.create({
				data: { id: user1Id, email: 'user1@example.com' },
			}),
			prisma.user.create({
				data: { id: user2Id, firstName: 'Adam', lastName: 'Smith', email: 'user2@example.com' },
			}),
			prisma.company.create({
				data: { id: company1Id, name: 'Test Company' },
			}),
			prisma.company.create({
				data: { id: company2Id, name: 'Test Company 2' },
			}),
			prisma.review.create({
				data: {
					id: '1',
					reviewerId: user1Id,
					companyId: company1Id,
					createdOn: '2020-01-01T00:00:00.000Z',
				},
			}),
			prisma.review.create({
				data: {
					id: '3',
					reviewerId: user2Id,
					companyId: company1Id,
					createdOn: '2022-01-01T00:00:00.000Z',
				},
			}),
			prisma.review.create({
				data: {
					id: '2',
					reviewerId: user2Id,
					companyId: company2Id,
					createdOn: '2021-01-01T00:00:00.000Z',
				},
			}),
		]);
	});

	afterEach(async () => {
		await prisma.review.deleteMany({ where: {} });
		await prisma.user.deleteMany({ where: {} });
		await prisma.company.deleteMany({ where: {} });
	});

	describe('getReviewsCount()', () => {
		it('should return number of reviews', async () => {
			const response = await request(app.getHttpServer()).get('/reviews/count');
			expect(response.status).toBe(200);
			expect(response.body.reviewsCount).toBe(3);
		});
	});

	describe('getReviews()', () => {
		it('should fetch all reviews', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?page=1&limit=10');
			expect(response.status).toBe(200);
			expect(response.body.reviews.length).toBe(3);
		});

		it('should fetch reviews in descending order by date', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?page=1&limit=10');
			const dateIndexZero = new Date(response.body.reviews[0].createdOn);
			const dateIndexOne = new Date(response.body.reviews[1].createdOn);
			const dateIndexTwo = new Date(response.body.reviews[2].createdOn);

			expect(response.status).toBe(200);
			expect(response.body.reviews).toBeDefined();
			expect(response.body.reviews[0].id).toBe('3');
			expect(response.body.reviews[1].id).toBe('2');
			expect(response.body.reviews[2].id).toBe('1');
			// expect the dates to be in descending order
			expect(dateIndexZero > dateIndexOne).toBe(true);
			expect(dateIndexOne > dateIndexTwo).toBe(true);
		});

		it('should include user data with review', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?page=1&limit=10');
			expect(response.status).toBe(200);
			expect(response.body.reviews[0].user).toBeDefined();
			expect(response.body.reviews[0].user.id).toBe(user2Id);
			expect(response.body.reviews[0].user.firstName).toBe('Adam');
			expect(response.body.reviews[0].user.lastName).toBe('Smith');
			expect(response.body.reviews[0].user.email).toBe('user2@example.com');
		});

		it('should include company data with review', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?page=1&limit=10');
			expect(response.status).toBe(200);
			expect(response.body.reviews[0].company).toBeDefined();
			expect(response.body.reviews[0].company.id).toBe(company1Id);
			expect(response.body.reviews[0].company.name).toBe('Test Company');
		});

		it('should return a 400 response when limit < 1', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?page=1&limit=0');
			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Invalid limit value: 0');
			expect(response.body.reviews).toBeUndefined();
		});

		it('should return a 400 response when page < 1', async () => {
			const response = await request(app.getHttpServer()).get('/reviews?page=0&limit=10');
			expect(response.status).toBe(400);
			expect(response.body.message).toBe('Invalid page number: 0');
			expect(response.body.reviews).toBeUndefined();
		});

		/* I haven't yet figured out a clean way to test the try/catch block without changing the ReviewsController
			code to allow the test to throw an error, but that test will go here once I have a better idea of how to do it */
	});
});
