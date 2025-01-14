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
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
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

	const handleDeleteUser = async (userId: number) => {
		if (!confirm("Czy na pewno chcesz usunąć tego użytkownika?")) return;
		try {
			await api.delete(`/admin/users/${userId}`);
			setSuccessMessage("Użytkownik został pomyślnie usunięty.");
			setUsers((prev) => prev.filter((user) => user.id !== userId));
		} catch (error) {
			setErrorMessage("Nie udało się usunąć użytkownika.");
		}
	};

	const handleSort = (column: string) => {
		setSortColumn(column);
		setSortDirection(sortDirection === "asc" ? "desc" : "asc");
	};

	return (
		<div className='container mx-auto p-6'>
			<h1 className='text-3xl font-bold mb-6'>Użytkownicy</h1>
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
							<TableCell onClick={() => handleSort("name")}>
								<strong>Imię</strong>
								<IconButton>
									{sortColumn === "name" && sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									)}
								</IconButton>
							</TableCell>
							<TableCell onClick={() => handleSort("email")}>
								<strong>Email</strong>
								<IconButton>
									{sortColumn === "email" && sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									)}
								</IconButton>
							</TableCell>
							<TableCell onClick={() => handleSort("created_at")}>
								<strong>Data utworzenia</strong>
								<IconButton>
									{sortColumn === "created_at" && sortDirection === "asc" ? (
										<ArrowUpward />
									) : (
										<ArrowDownward />
									)}
								</IconButton>
							</TableCell>
							<TableCell onClick={() => handleSort("roles")}>
								<strong>Rola</strong>
								<IconButton>
									{sortColumn === "roles" && sortDirection === "asc" ? (
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
						{filteredUsers
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((user) => (
								<TableRow key={user.id}>
									<TableCell>{user.id}</TableCell>
									<TableCell>{user.name}</TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{new Date(user.created_at).toLocaleString()}
									</TableCell>
									<TableCell>
										{user.roles.map((role) => role.name).join(", ")}
									</TableCell>
									<TableCell>
										<Link href={`/admin/users/${user.id}/edit`}>
											<Button variant='outlined' color='primary'>
												Edytuj
											</Button>
										</Link>
										<Button
											variant='outlined'
											color='error'
											startIcon={<DeleteIcon />}
											onClick={() => handleDeleteUser(user.id)}
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
		</div>
	);
};

export default AdminUsersPage;
