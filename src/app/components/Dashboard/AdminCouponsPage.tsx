"use client";

import React, { useEffect, useState } from "react";
import {
	Button,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableFooter,
	TablePagination,
	TableRow,
	TableHead,
	Paper,
	Alert,
	TableSortLabel,
	TextField,
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
	const [filteredCoupons, setFilteredCoupons] = useState<Coupon[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [order, setOrder] = useState<"asc" | "desc">("asc");
	const [orderBy, setOrderBy] = useState<keyof Coupon | string>("id");
	const [searchQuery, setSearchQuery] = useState<string>("");

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

	useEffect(() => {
		setFilteredCoupons(
			coupons.filter(
				(coupon) =>
					coupon.id.toString().includes(searchQuery) ||
					coupon.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					coupon.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
					coupon.numbers.join(", ").includes(searchQuery)
			)
		);
	}, [searchQuery, coupons]);

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
		} catch {
			setErrorMessage("Nie udało się usunąć kuponu.");
		}
	};

	const handleRequestSort = (property: keyof Coupon | string) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const stableSort = (
		array: Coupon[],
		comparator: (a: Coupon, b: Coupon) => number
	) => {
		const stabilizedThis = array.map(
			(el, index) => [el, index] as [Coupon, number]
		);
		stabilizedThis.sort((a, b) => {
			const order = comparator(a[0], b[0]);
			if (order !== 0) return order;
			return a[1] - b[1];
		});
		return stabilizedThis.map((el) => el[0]);
	};

	const getComparator = (
		order: "asc" | "desc",
		orderBy: keyof Coupon | string
	) => {
		return order === "desc"
			? (a: Coupon, b: Coupon) => {
					if (orderBy === "user.name") {
						return a.user.name < b.user.name ? 1 : -1;
					}
					if (orderBy === "user.email") {
						return a.user.email < b.user.email ? 1 : -1;
					}
					return a[orderBy as keyof Coupon] < b[orderBy as keyof Coupon]
						? 1
						: -1;
			  }
			: (a: Coupon, b: Coupon) => {
					if (orderBy === "user.name") {
						return a.user.name < b.user.name ? -1 : 1;
					}
					if (orderBy === "user.email") {
						return a.user.email < b.user.email ? -1 : 1;
					}
					return a[orderBy as keyof Coupon] < b[orderBy as keyof Coupon]
						? -1
						: 1;
			  };
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

			<TextField
				label='Filtruj'
				variant='outlined'
				fullWidth
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				className='mb-4'
			/>

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>
								<TableSortLabel
									active={orderBy === "id"}
									direction={orderBy === "id" ? order : "asc"}
									onClick={() => handleRequestSort("id")}>
									<strong>ID</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "user.name"}
									direction={orderBy === "user.name" ? order : "asc"}
									onClick={() => handleRequestSort("user.name")}>
									<strong>Użytkownik</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "user.email"}
									direction={orderBy === "user.email" ? order : "asc"}
									onClick={() => handleRequestSort("user.email")}>
									<strong>Email</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "numbers"}
									direction={orderBy === "numbers" ? order : "asc"}
									onClick={() => handleRequestSort("numbers")}>
									<strong>Liczby</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<TableSortLabel
									active={orderBy === "draws"}
									direction={orderBy === "draws" ? order : "asc"}
									onClick={() => handleRequestSort("draws")}>
									<strong>Losowania</strong>
								</TableSortLabel>
							</TableCell>
							<TableCell>
								<strong>Operacje</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{stableSort(filteredCoupons, getComparator(order, orderBy))
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
								count={filteredCoupons.length}
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
