"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TablePagination,
	TableRow,
	Paper,
	Alert,
} from "@mui/material";
import { Delete as DeleteIcon } from "@mui/icons-material";
import Link from "next/link";
import api from "../../../services/api";

interface Coupon {
	id: number;
	user: {
		id: number;
		name: string;
		email: string;
	};
	numbers: number[];
	draws: {
		id: number;
		draw_date: string;
	}[];
}

const AdminCouponsPage: React.FC = () => {
	const [coupons, setCoupons] = useState<Coupon[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	useEffect(() => {
		const fetchCoupons = async () => {
			try {
				const response = await api.get("/admin/coupons");
				setCoupons(response.data.data || response.data);
			} catch {
				setErrorMessage("Nie udało się pobrać listy kuponów.");
			}
		};
		fetchCoupons();
	}, []);

	const handleChangePage = (
		event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleDeleteCoupon = async (couponId: number) => {
		if (!confirm("Czy na pewno chcesz usunąć ten kupon?")) return;
		try {
			await api.delete(`/admin/coupons/${couponId}`);
			setSuccessMessage("Kupon został pomyślnie usunięty.");
			setCoupons((prev) => prev.filter((coupon) => coupon.id !== couponId));
		} catch (error) {
			setErrorMessage("Nie udało się usunąć kuponu.");
		}
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6'>Kupony użytkowników</h1>
			{successMessage && (
				<Alert
					severity='success'
					onClose={() => setSuccessMessage(null)}
					className='mb-4'>
					{successMessage}
				</Alert>
			)}
			{errorMessage && (
				<Alert
					severity='error'
					onClose={() => setErrorMessage(null)}
					className='mb-4'>
					{errorMessage}
				</Alert>
			)}

			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						{coupons
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((coupon) => (
								<TableRow key={coupon.id}>
									<TableCell>{coupon.id}</TableCell>
									<TableCell>{coupon.user.name}</TableCell>
									<TableCell>{coupon.user.email}</TableCell>
									<TableCell>{coupon.numbers.join(", ")}</TableCell>
									<TableCell>
										{Array.isArray(coupon.draws) && coupon.draws.length > 0 ? (
											coupon.draws.map((draw) => (
												<p key={draw.id}>
													{new Date(draw.draw_date).toLocaleString()}
												</p>
											))
										) : (
											<p className='text-gray-500'>
												Brak losowań przypisanych do kuponu
											</p>
										)}
									</TableCell>
									<TableCell>
										<Link href={`/admin/coupons/${coupon.id}/edit`}>
											<Button variant='outlined' color='primary'>
												Edytuj
											</Button>
										</Link>
										<Button
											variant='outlined'
											color='error'
											startIcon={<DeleteIcon />}
											onClick={() => handleDeleteCoupon(coupon.id)}
											className='ml-2'>
											Usuń
										</Button>
									</TableCell>
								</TableRow>
							))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25]}
								count={coupons.length}
								rowsPerPage={rowsPerPage}
								page={page}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</div>
	);
};

export default AdminCouponsPage;
