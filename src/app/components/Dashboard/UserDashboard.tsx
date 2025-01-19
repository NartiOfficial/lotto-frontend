"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@mui/material";

interface Draw {
	id: number;
	draw_date: string;
}

interface Coupon {
	id: number;
	numbers: number[];
	draws: Draw[];
}

const UserDashboard: React.FC = () => {
	const { user, logout } = useContext(AuthContext) || {};
	const router = useRouter();
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!user) {
			router.push("/login");
			return;
		}

		const fetchCoupons = async () => {
			try {
				const response = await api.get("/user/coupons");
				setCoupons(response.data);
				setLoading(false);
			} catch {
				setError("Nie udało się pobrać kuponów.");
				setLoading(false);
			}
		};

		fetchCoupons();
	}, [user, router]);

	const formatDates = (draws: Draw[]) => {
		if (draws.length === 0) return "Brak losowań";
		return (
			<ul className='list-disc pl-4'>
				{draws.map((draw) => (
					<li key={draw.id} className='text-black'>
						{new Date(draw.draw_date).toLocaleString("pl-PL", {
							year: "numeric",
							month: "long",
							day: "numeric",
							hour: "2-digit",
							minute: "2-digit",
						})}
					</li>
				))}
			</ul>
		);
	};

	return (
		<div className='container mx-auto p-6'>
			<div className='flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-lg shadow-md mb-6'>
				<div className='text-black'>
					<h1 className='text-3xl font-bold'>Witaj, {user?.name}</h1>
					<p className='text-lg'>Twój email: {user?.email}</p>
				</div>
				<div className='space-x-4'>
					<Link href='/coupons/purchase'>
						<Button variant='contained' color='primary'>
							Zakup Kupon
						</Button>
					</Link>
					<Button
						variant='contained'
						color='secondary'
						onClick={() =>
							logout && logout().then(() => router.push("/login"))
						}>
						Wyloguj się
					</Button>
				</div>
			</div>

			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-2xl font-semibold mb-4 text-black'>Twoje kupony</h2>
				{loading ? (
					<p>Ładowanie kuponów...</p>
				) : error ? (
					<p className='text-red-500'>{error}</p>
				) : coupons.length === 0 ? (
					<p className='text-gray-500'>Nie masz jeszcze żadnych kuponów.</p>
				) : (
					<table className='w-full border-collapse border border-gray-300 text-black'>
						<thead className='bg-gray-200'>
							<tr>
								<th className='border p-2'>ID</th>
								<th className='border p-2'>Daty losowania</th>
								<th className='border p-2'>Liczby</th>
								<th className='border p-2'>Akcje</th>
							</tr>
						</thead>
						<tbody>
							{coupons.map((coupon) => (
								<tr key={coupon.id}>
									<td className='border p-2'>{coupon.id}</td>
									<td className='border p-2'>{formatDates(coupon.draws)}</td>
									<td className='border p-2'>{coupon.numbers.join(", ")}</td>
									<td className='border p-2'>
										<Link href={`/coupons/${coupon.id}/results`}>
											<Button variant='outlined' color='primary'>
												Sprawdź wyniki
											</Button>
										</Link>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				)}
			</div>
		</div>
	);
};

export default UserDashboard;
