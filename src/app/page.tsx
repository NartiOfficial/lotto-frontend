"use client";

import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
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
				<Link href='/play'>
					<button className='bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-4 rounded-lg font-semibold text-lg'>
						Graj teraz!
					</button>
				</Link>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-8 py-12'>
				<div className='bg-white text-black rounded-lg shadow-lg p-6 text-center'>
					<h2 className='text-2xl font-bold mb-4'>Lotto</h2>
					<p className='text-lg mb-6'>Kumulacja: 8 000 000 zł</p>
					<Link href='/lotto'>
						<button className='bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md'>
							Zagraj online
						</button>
					</Link>
				</div>
				<div className='bg-white text-black rounded-lg shadow-lg p-6 text-center'>
					<h2 className='text-2xl font-bold mb-4'>Multi Multi</h2>
					<p className='text-lg mb-6'>Nagrody: 25 000 000 zł</p>
					<Link href='/multi-multi'>
						<button className='bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md'>
							Zagraj online
						</button>
					</Link>
				</div>
				<div className='bg-white text-black rounded-lg shadow-lg p-6 text-center'>
					<h2 className='text-2xl font-bold mb-4'>Mini Lotto</h2>
					<p className='text-lg mb-6'>Nagrody: 1 000 000 zł</p>
					<Link href='/mini-lotto'>
						<button className='bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md'>
							Zagraj online
						</button>
					</Link>
				</div>
			</div>
		</>
	);
};

export default Home;
