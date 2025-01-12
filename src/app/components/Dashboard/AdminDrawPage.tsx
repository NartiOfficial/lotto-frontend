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
	TableHead,
	Paper,
	Alert,
	TextField,
	IconButton,
} from "@mui/material";
import {
	Delete as DeleteIcon,
	ArrowUpward,
	ArrowDownward,
} from "@mui/icons-material";
import Link from "next/link";
import api from "../../../services/api";

interface Draw {
	id: number;
	draw_date: string;
	winning_numbers: number[] | null;
	created_at: string;
}

const AdminDrawsPage: React.FC = () => {
	const [draws, setDraws] = useState<Draw[]>([]);
	const [filteredDraws, setFilteredDraws] = useState<Draw[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");

	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [sortColumn, setSortColumn] = useState<string>("id");

	useEffect(() => {
		const fetchDraws = async () => {
			try {
				const response = await api.get("/draws");
				setDraws(response.data.data || response.data);
			} catch {
				setErrorMessage("Nie udało się pobrać listy losowań.");
			}
		};
		fetchDraws();
	}, []);

	useEffect(() => {
		let sortedDraws = [...draws];

		if (sortDirection === "asc") {
			sortedDraws.sort((a, b) => {
				if (sortColumn === "id") {
					return a.id > b.id ? 1 : -1;
				} else if (sortColumn === "draw_date") {
					return new Date(a.draw_date) > new Date(b.draw_date) ? 1 : -1;
				} else if (sortColumn === "winning_numbers") {
					return (a.winning_numbers?.join(", ") || "") >
						(b.winning_numbers?.join(", ") || "")
						? 1
						: -1;
				}
				return 0;
			});
		} else {
			sortedDraws.sort((a, b) => {
				if (sortColumn === "id") {
					return a.id < b.id ? 1 : -1;
				} else if (sortColumn === "draw_date") {
					return new Date(a.draw_date) < new Date(b.draw_date) ? 1 : -1;
				} else if (sortColumn === "winning_numbers") {
					return (a.winning_numbers?.join(", ") || "") <
						(b.winning_numbers?.join(", ") || "")
						? 1
						: -1;
				}
				return 0;
			});
		}

		setFilteredDraws(
			sortedDraws.filter(
				(draw) =>
					draw.id.toString().includes(searchQuery) ||
					new Date(draw.draw_date).toLocaleString().includes(searchQuery) ||
					(draw.winning_numbers
						? draw.winning_numbers.join(", ").includes(searchQuery)
						: false)
			)
		);
	}, [searchQuery, draws, sortColumn, sortDirection]);

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

	const handleDeleteDraw = async (drawId: number) => {
		if (!confirm("Czy na pewno chcesz usunąć to losowanie?")) return;
		try {
			await api.delete(`/admin/draws/${drawId}`);
			setSuccessMessage("Losowanie zostało pomyślnie usunięte.");
			setDraws((prev) => prev.filter((draw) => draw.id !== drawId));
		} catch (error) {
			setErrorMessage("Nie udało się usunąć losowania.");
		}
	};

	const handleSort = (column: string) => {
		setSortColumn(column);
		setSortDirection(sortDirection === "asc" ? "desc" : "asc");
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6'>Wyniki losowań</h1>
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
							<TableCell onClick={() => handleSort("id")}>
								<strong>ID</strong>
								<IconButton>
									{sortColumn === "id" && sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									)}
								</IconButton>
							</TableCell>
							<TableCell onClick={() => handleSort("draw_date")}>
								<strong>Data losowania</strong>
								<IconButton>
									{sortColumn === "draw_date" && sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									)}
								</IconButton>
							</TableCell>
							<TableCell onClick={() => handleSort("winning_numbers")}>
								<strong>Wyniki losowania</strong>
								<IconButton>
									{sortColumn === "winning_numbers" &&
									sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									)}
								</IconButton>
							</TableCell>
							<TableCell>
								<strong>Operacje</strong>
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredDraws
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((draw) => (
								<TableRow key={draw.id}>
									<TableCell>{draw.id}</TableCell>
									<TableCell>
										{new Date(draw.draw_date).toLocaleString()}
									</TableCell>
									<TableCell>
										{draw.winning_numbers ? (
											draw.winning_numbers.join(", ")
										) : (
											<p className='text-gray-500'>Brak wyników</p>
										)}
									</TableCell>
									<TableCell>
										<Link href={`/admin/draws/${draw.id}/edit`}>
											<Button variant='outlined' color='primary'>
												Edytuj
											</Button>
										</Link>
										<Button
											variant='outlined'
											color='error'
											startIcon={<DeleteIcon />}
											onClick={() => handleDeleteDraw(draw.id)}
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
								count={filteredDraws.length}
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

export default AdminDrawsPage;
