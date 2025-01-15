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
	IconButton,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import api from "../../../services/api";

interface User {
	id: number;
	name: string;
	email: string;
	created_at: string;
	roles: { name: string }[];
}

const AdminUsersPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState<string>("");
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const [sortColumn, setSortColumn] = useState<string>("id");

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await api.get("/admin/users");
				setUsers(response.data.data || response.data);
			} catch {
				setErrorMessage("Nie udało się pobrać listy użytkowników.");
			}
		};
		fetchUsers();
	}, []);

	useEffect(() => {
		let sortedUsers = [...users];

		if (sortColumn === "roles") {
			sortedUsers.sort((a, b) => {
				const roleA = a.roles.length ? a.roles[0].name : "";
				const roleB = b.roles.length ? b.roles[0].name : "";
				if (roleA > roleB) return sortDirection === "asc" ? 1 : -1;
				if (roleA < roleB) return sortDirection === "asc" ? -1 : 1;
				return 0;
			});
		} else {
			if (sortDirection === "asc") {
				sortedUsers.sort((a, b) =>
					a[sortColumn as keyof User] > b[sortColumn as keyof User] ? 1 : -1
				);
			} else {
				sortedUsers.sort((a, b) =>
					a[sortColumn as keyof User] < b[sortColumn as keyof User] ? 1 : -1
				);
			}
		}

		setFilteredUsers(
			sortedUsers.filter(
				(user) =>
					user.id.toString().includes(searchQuery) ||
					user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
					user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
					new Date(user.created_at).toLocaleString().includes(searchQuery)
			)
		);
	}, [searchQuery, users, sortColumn, sortDirection]);

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
				Lista użytkowników
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
							<TableCell onClick={() => handleSort("name")}>
								<strong>Imię</strong>
								{sortColumn === "name" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
							<TableCell onClick={() => handleSort("email")}>
								<strong>Email</strong>
								{sortColumn === "email" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
							<TableCell onClick={() => handleSort("created_at")}>
								<strong>Data utworzenia</strong>
								{sortColumn === "created_at" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
							<TableCell onClick={() => handleSort("roles")}>
								<strong>Rola</strong>
								{sortColumn === "roles" &&
									(sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									))}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredUsers
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((user) => (
								<TableRow key={user.id} hover>
									<TableCell>{user.id}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{new Date(user.created_at).toLocaleString()}
									</TableCell>
									<TableCell>
										{user.roles.map((role) => role.name).join(", ")}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
					<TableFooter>
						<TableRow>
							<TablePagination
								rowsPerPageOptions={[5, 10, 25]}
								count={filteredUsers.length}
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

export default AdminUsersPage;
