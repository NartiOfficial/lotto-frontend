"use client";

import React, { useEffect, useState } from "react";
import {
	Box,
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
	Typography,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
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

	const handleSort = (column: string) => {
		setSortColumn(column);
		setSortDirection(sortDirection === "asc" ? "desc" : "asc");
	};

	return (
		<Box
			sx={{
				maxWidth: "80%",
				margin: "auto",
				padding: "2rem",
				borderRadius: "12px",
			}}>
			<Typography variant='h4' component='h1' gutterBottom>
				Wyniki losowań
			</Typography>
			{errorMessage && (
				<Alert
					severity='error'
					onClose={() => setErrorMessage(null)}
					sx={{ marginBottom: "1rem" }}>
					{errorMessage}
				</Alert>
			)}

			<TextField
				label='Filtruj'
				variant='outlined'
				size='small'
				sx={{
					maxWidth: "300px",
					marginBottom: "1.5rem",
					backgroundColor: "white",
					borderRadius: "8px",
				}}
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>

			<TableContainer
				component={Paper}
				elevation={3}
				sx={{ borderRadius: "12px" }}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell onClick={() => handleSort("id")}>
								<strong>ID</strong>
								{sortColumn === "id" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
							<TableCell onClick={() => handleSort("draw_date")}>
								<strong>Data losowania</strong>
								{sortColumn === "draw_date" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
							<TableCell onClick={() => handleSort("winning_numbers")}>
								<strong>Wyniki losowania</strong>
								{sortColumn === "winning_numbers" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredDraws
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((draw) => (
								<TableRow key={draw.id} hover>
									<TableCell>{draw.id}</TableCell>
									<TableCell>
										{new Date(draw.draw_date).toLocaleString()}
									</TableCell>
									<TableCell>
										{draw.winning_numbers ? (
											draw.winning_numbers.join(", ")
										) : (
											<Typography variant='body2' color='textSecondary'>
												Brak wyników
											</Typography>
										)}
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
		</Box>
	);
};

export default AdminDrawsPage;
