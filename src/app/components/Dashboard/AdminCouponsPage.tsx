"use client";

import React, { useEffect, useState } from "react";
import {
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
	Box,
	Typography,
} from "@mui/material";
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
		<Box
			sx={{
				maxWidth: "80%",
				margin: "auto",
				padding: "2rem",
				borderRadius: "12px",
				paddingBottom: "10rem",
			}}>
			<Typography variant='h4' component='h1' gutterBottom>
				Kupony użytkowników
			</Typography>
			{errorMessage && (
				<Alert
					severity='error'
					onClose={() => setErrorMessage(null)}
					sx={{ marginBottom: "1rem" }}>
					{errorMessage}
				</Alert>
			)}

			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					marginBottom: "1.5rem",
				}}>
				<TextField
					label='Filtruj'
					variant='outlined'
					size='small'
					sx={{
						maxWidth: "300px",
						backgroundColor: "white",
						borderRadius: "8px",
					}}
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</Box>

			<TableContainer
				component={Paper}
				elevation={3}
				sx={{ borderRadius: "12px" }}>
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
						</TableRow>
					</TableHead>
					<TableBody>
						{stableSort(filteredCoupons, getComparator(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((coupon) => (
								<TableRow key={coupon.id} hover>
									<TableCell>{coupon.id}</TableCell>
									<TableCell>{coupon.user.name}</TableCell>
									<TableCell>{coupon.user.email}</TableCell>
									<TableCell>{coupon.numbers.join(", ")}</TableCell>
									<TableCell>
										{Array.isArray(coupon.draws) && coupon.draws.length > 0 ? (
											coupon.draws.map((draw) => (
												<Typography key={draw.id} variant='body2'>
													{new Date(draw.draw_date).toLocaleString()}
												</Typography>
											))
										) : (
											<Typography variant='body2' color='textSecondary'>
												Brak losowań przypisanych do kuponu
											</Typography>
										)}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, 50]}
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
		</Box>
	);
};

export default AdminCouponsPage;
