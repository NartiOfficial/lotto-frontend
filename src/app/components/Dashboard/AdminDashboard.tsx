"use client";

import React from "react";
import Link from "next/link";

const AdminDashboard: React.FC = () => {
	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6 text-center'>
				Panel Administratora
			</h1>
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				<Link
					href='/admin/coupons'
					className='shadow-lg rounded-lg p-6 bg-blue-500 hover:bg-blue-600 text-white text-center transition duration-300'>
					<h2 className='text-2xl font-semibold mb-2'>Zarządzaj Kuponami</h2>
					<p className='text-sm'>
						Przejdź do listy wszystkich kuponów użytkowników
					</p>
				</Link>

				<Link
					href='/admin/draws'
					className='shadow-lg rounded-lg p-6 bg-green-500 hover:bg-green-600 text-white text-center transition duration-300'>
					<h2 className='text-2xl font-semibold mb-2'>Zarządzaj Losowaniami</h2>
					<p className='text-sm'>
						Sprawdź i zarządzaj przyszłymi losowaniami Lotto
					</p>
				</Link>

				<Link
					href='/admin/users'
					className='shadow-lg rounded-lg p-6 bg-yellow-500 hover:bg-yellow-600 text-white text-center transition duration-300'>
					<h2 className='text-2xl font-semibold mb-2'>
						Zarządzaj Użytkownikami
					</h2>
					<p className='text-sm'>Wyświetl listę użytkowników i ich działania</p>
				</Link>
			</div>
		</div>
	);
};

export default AdminDashboard;
