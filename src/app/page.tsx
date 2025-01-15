"use client";

import React, { useEffect, useState } from "react";
import { Box, Button, Typography, Alert, Grid, Paper } from "@mui/material";
import Link from "next/link";

interface Draw {
	id: number;
	draw_date: string;
	winning_numbers: number[] | null;
}

const Home: React.FC = () => {
	const [draws, setDraws] = useState<Draw[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const fetchDraws = async () => {
			try {
				const response = await fetch("http://localhost/api/draws");
				if (!response.ok) {
					throw new Error("Błąd podczas pobierania danych");
				}
				const data = await response.json();
				setDraws(data);
			} catch {
				setErrorMessage("Nie udało się pobrać danych o losowaniach.");
			}
		};
		fetchDraws();
	}, []);

	const completedDraws = draws.filter((draw) => draw.winning_numbers !== null);
	const nextDraw = draws.find((draw) => draw.winning_numbers === null);

	return (
		<>
			<div className='flex flex-col items-center justify-center text-center py-16 px-8'>
				<h1 className='text-5xl font-extrabold mb-6'>
					LOTTO – graj i wygrywaj!
				</h1>
				<p className='text-xl max-w-2xl mb-8'>
					Dołącz do zabawy i sprawdź swoje szczęście! Zagraj online i sprawdź
					wyniki swoich ulubionych gier losowych.
				</p>
				<Button
					variant='contained'
					color='primary'
					href='/login'
					className='px-6 py-4 rounded-lg font-semibold text-lg'>
					Graj teraz!
				</Button>
			</div>

			{errorMessage && (
				<Alert severity='error' className='mb-4'>
					{errorMessage}
				</Alert>
			)}

			{/* Okna z ostatnimi wygranymi i datą następnego losowania */}
			<Grid
				container
				spacing={4}
				justifyContent='center'
				className='px-8 py-12'>
				<Grid item xs={12} sm={6} md={4}>
					<Paper className='p-6 text-center'>
						<Typography variant='h6' className='mb-4'>
							Ostatnie wygrane
						</Typography>
						{completedDraws.slice(0, 3).map((draw) => (
							<Box key={draw.id} className='mb-4'>
								<Typography variant='body1'>
									<b>Data:</b> {new Date(draw.draw_date).toLocaleString()}
								</Typography>
								<Typography variant='body1'>
									<b>Wyniki:</b> {draw.winning_numbers?.join(", ")}
								</Typography>
							</Box>
						))}
					</Paper>
				</Grid>

				<Grid item xs={12} sm={6} md={4}>
					<Paper className='p-6 text-center'>
						<Typography variant='h6' className='mb-4'>
							Następne losowanie
						</Typography>
						{nextDraw ? (
							<Typography variant='body1'>
								<b>Data:</b> {new Date(nextDraw.draw_date).toLocaleString()}
							</Typography>
						) : (
							<Typography variant='body1'>
								Brak dostępnych danych o losowaniach.
							</Typography>
						)}
					</Paper>
				</Grid>
			</Grid>

			{/* Okna z grami */}
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12'>
				<div className='bg-white text-black rounded-lg shadow-lg p-6 text-center'>
					<h2 className='text-2xl font-bold mb-4'>Lotto</h2>
					<p className='text-lg mb-6'>Kumulacja: 8 000 000 zł</p>
					<Link href='/lotto'>
						<Button variant='outlined' color='primary'>
							Zagraj online
						</Button>
					</Link>
				</div>
				<div className='bg-white text-black rounded-lg shadow-lg p-6 text-center'>
					<h2 className='text-2xl font-bold mb-4'>Multi Multi</h2>
					<p className='text-lg mb-6'>Nagrody: 25 000 000 zł</p>
					<Link href='/multi-multi'>
						<Button variant='outlined' color='primary'>
							Zagraj online
						</Button>
					</Link>
				</div>
				<div className='bg-white text-black rounded-lg shadow-lg p-6 text-center'>
					<h2 className='text-2xl font-bold mb-4'>Mini Lotto</h2>
					<p className='text-lg mb-6'>Nagrody: 1 000 000 zł</p>
					<Link href='/mini-lotto'>
						<Button variant='outlined' color='primary'>
							Zagraj online
						</Button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default Home;
