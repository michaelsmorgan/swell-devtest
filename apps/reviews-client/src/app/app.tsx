import { useState } from 'react';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material/styles';
import WebFont from 'webfontloader';
import Header from './components/header/header';
import ReviewsList from './components/reviews-list/reviews-list';
import { theme } from './theme';

WebFont.load({
	google: {
		families: ['Montserrat:500,600,700'],
	},
});

export function App() {
	const [page, setPage] = useState(() => {
		const savedPage = sessionStorage.getItem('page');
		return savedPage ? Number(savedPage) : 1;
	});

	const limit = 50;

	return (
		<ThemeProvider theme={theme}>
			<Header />
			<Container sx={{ mt: 2, typography: 'body1' }}>
				<ReviewsList page={page} limit={limit} setPage={setPage} />
			</Container>
		</ThemeProvider>
	);
}

export default App;
