"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
	Box,
	Button,
	TextField,
	Typography,
	Alert,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";
import api from "../../../../services/api";

interface User {
	id: number;
	name: string;
	email: string;
	roles: string[];
}

const EditUserPage: React.FC = () => {
	const router = useRouter();
	const { id } = useParams();
	const [user, setUser] = useState<User | null>(null);
	const [name, setName] = useState<string>("");
	const [email, setEmail] = useState<string>("");
	const [role, setRole] = useState<string>("user");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const response = await api.get(`/admin/users/${id}`);
				const userData = response.data;
				setUser(userData);
				setName(userData.name);
				setEmail(userData.email);
				setRole(userData.roles[0] || "user");
			} catch (error) {
				setErrorMessage("Nie udało się załadować danych użytkownika.");
			}
		};

		fetchUser();
	}, [id]);

	const handleUpdateUser = async () => {
		if (!name || !email) {
			setErrorMessage("Imię i email są wymagane.");
			return;
		}

		const updatedUser = { name, email, role };

		try {
			const response = await api.put(`/admin/users/${id}`, updatedUser);
			setSuccessMessage("Dane użytkownika zostały zaktualizowane!");
			setTimeout(() => router.push("/admin/users"), 2000);
		} catch (error) {
			setErrorMessage("Nie udało się zaktualizować danych użytkownika.");
		}
	};

	return (
		<Box
			sx={{
				width: 600,
				margin: "auto",
				marginTop: 8,
				padding: 4,
				boxShadow: 3,
				borderRadius: 2,
				bgcolor: "background.paper",
			}}>
			<Typography variant='h5' className='mb-4'>
				Edytuj użytkownika
			</Typography>
			{errorMessage && (
				<Alert severity='error' className='mb-4'>
					{errorMessage}
				</Alert>
			)}
			{successMessage && (
				<Alert severity='success' className='mb-4'>
					{successMessage}
				</Alert>
			)}

			<TextField
				label='Imię'
				variant='outlined'
				fullWidth
				value={name}
				onChange={(e) => setName(e.target.value)}
				className='mb-4'
			/>
			<TextField
				label='Email'
				variant='outlined'
				fullWidth
				value={email}
				onChange={(e) => setEmail(e.target.value)}
				className='mb-4'
			/>
			<FormControl fullWidth className='mb-4'>
				<InputLabel>Rola</InputLabel>
				<Select value={role} onChange={(e) => setRole(e.target.value)}>
					<MenuItem value='user'>User</MenuItem>
					<MenuItem value='admin'>Admin</MenuItem>
				</Select>
			</FormControl>
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button onClick={handleUpdateUser} variant='contained' color='primary'>
					Zapisz
				</Button>
				<Button
					onClick={() => router.push("/admin/users")}
					variant='outlined'
					color='secondary'
					className='ml-2'>
					Anuluj
				</Button>
			</Box>
		</Box>
	);
};

export default EditUserPage;
