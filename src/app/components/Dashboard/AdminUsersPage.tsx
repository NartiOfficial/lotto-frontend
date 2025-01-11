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

interface User {
	id: number;
	name: string;
	email: string;
	created_at: string;
	roles: { name: string }[]; // Lista ról użytkownika
}

const AdminUsersPage: React.FC = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(15);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

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

			<TableContainer component={Paper}>
				<Table>
					<TableBody>
						{users
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
								count={users.length}
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
