import { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import WebFont from 'webfontloader';
import Header from './components/header/header';
import ReviewsList from './components/reviews-list/reviews-list';
import { theme } from './theme';

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

WebFont.load({
	google: {
		families: ['Montserrat:500,600,700'],
	},
});

export function App() {
	const [reviews, setReviews] = useState<Review[]>([]);
	const [totalReviews, setTotalReviews] = useState(0);
	const [page, setPage] = useState(() => {
		const savedPage = sessionStorage.getItem('page');
		return savedPage ? Number(savedPage) : 1;
	});
	const limit = 50;

	const fetchReviews = (page: number) => {
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
		]).catch((error) => {
			console.error('Error:', error);
		});
	};

	useEffect(() => {
		fetchReviews(page);
	}, [page]);

	return (
		<ThemeProvider theme={theme}>
			<Header />
			<Container sx={{ mt: 2, typography: 'body1' }}>
				<ReviewsList
					reviews={reviews}
					totalReviews={totalReviews}
					page={page}
					limit={limit}
					setPage={setPage}
					fetchReviews={fetchReviews}
				/>
			</Container>
		</ThemeProvider>
	);
}

export default App;
