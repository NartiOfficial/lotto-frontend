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
	Chip,
} from "@mui/material";
import api from "../../../../services/api";

interface User {
	id: number;
	name: string;
	email: string;
}

interface Draw {
	id: number;
	draw_date: string;
}

const EditCouponPage: React.FC = () => {
	const router = useRouter();
	const { id } = useParams();
	const [numbers, setNumbers] = useState<string>(""); // Liczby kuponu
	const [selectedUserId, setSelectedUserId] = useState<number | null>(null); // Wybrany użytkownik
	const [selectedDraws, setSelectedDraws] = useState<number[]>([]); // Wybrane losowania
	const [users, setUsers] = useState<User[]>([]); // Lista użytkowników
	const [draws, setDraws] = useState<Draw[]>([]); // Lista losowań
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);

	// Pobieranie danych kuponu
	useEffect(() => {
		const fetchCoupon = async () => {
			try {
				const response = await api.get(`/admin/coupons/${id}`);
				const coupon = response.data;
				setNumbers(coupon.numbers.join(", "));
				setSelectedUserId(coupon.user.id);
				setSelectedDraws(coupon.draws.map((draw) => draw.id));
			} catch (error) {
				setErrorMessage("Nie udało się załadować danych kuponu.");
			}
		};

		fetchCoupon();
	}, [id]);

	// Pobieranie listy użytkowników
	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await api.get("/admin/users");
				setUsers(response.data);
			} catch (error) {
				setErrorMessage("Nie udało się załadować listy użytkowników.");
			}
		};

		fetchUsers();
	}, []);

	// Pobieranie listy losowań
	useEffect(() => {
		const fetchDraws = async () => {
			try {
				const response = await api.get("/draws");
				setDraws(response.data);
			} catch (error) {
				setErrorMessage("Nie udało się załadować listy losowań.");
			}
		};

		fetchDraws();
	}, []);

	// Obsługa edycji kuponu
	const handleEditCoupon = async () => {
		const numbersArray = numbers
			.split(",")
			.map((num) => parseInt(num.trim(), 10));

		if (
			numbersArray.length !== 6 ||
			numbersArray.some((num) => isNaN(num) || num < 1 || num > 49)
		) {
			setErrorMessage("Podaj dokładnie 6 poprawnych liczb z zakresu 1-49.");
			return;
		}

		if (!selectedUserId) {
			setErrorMessage("Musisz wybrać użytkownika.");
			return;
		}

		if (selectedDraws.length === 0) {
			setErrorMessage(
				"Musisz przypisać kupon do co najmniej jednego losowania."
			);
			return;
		}

		try {
			await api.put(`/admin/coupons/${id}`, {
				numbers: numbersArray,
				user_id: selectedUserId,
				draw_ids: selectedDraws,
			});
			setSuccessMessage("Kupon został zaktualizowany!");
			setTimeout(() => router.push("/admin/coupons"), 2000);
		} catch (error) {
			setErrorMessage("Nie udało się zaktualizować kuponu.");
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
				Edytuj kupon
			</Typography>
			{errorMessage && (
				<Alert severity='error' className='mb-4'>
					{errorMessage}
				</Alert>
			)}
			<FormControl fullWidth className='mb-4'>
				<InputLabel id='user-select-label'>Użytkownik</InputLabel>
				<Select
					labelId='user-select-label'
					value={selectedUserId || ""}
					onChange={(e) => setSelectedUserId(Number(e.target.value))}>
					{users.map((user) => (
						<MenuItem key={user.id} value={user.id}>
							{user.name} ({user.email})
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<TextField
				label='Liczby (6 liczb, oddzielone przecinkiem)'
				variant='outlined'
				fullWidth
				value={numbers}
				onChange={(e) => setNumbers(e.target.value)}
				className='mb-4'
			/>
			<FormControl fullWidth className='mb-4'>
				<InputLabel id='draws-select-label'>Losowania</InputLabel>
				<Select
					labelId='draws-select-label'
					multiple
					value={selectedDraws}
					onChange={(e) =>
						setSelectedDraws(
							typeof e.target.value === "string"
								? e.target.value.split(",").map(Number)
								: e.target.value
						)
					}
					renderValue={(selected) => (
						<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
							{selected.map((value) => (
								<Chip key={value} label={`Losowanie ${value}`} />
							))}
						</Box>
					)}>
					{draws.map((draw) => (
						<MenuItem key={draw.id} value={draw.id}>
							{new Date(draw.draw_date).toLocaleString()}
						</MenuItem>
					))}
				</Select>
			</FormControl>
			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button onClick={handleEditCoupon} variant='contained' color='primary'>
					Zapisz
				</Button>
				<Button
					onClick={() => router.push("/admin/coupons")}
					variant='outlined'
					color='secondary'
					className='ml-2'>
					Anuluj
				</Button>
			</Box>
			{successMessage && (
				<Alert severity='success' className='mt-4'>
					{successMessage}
				</Alert>
			)}
		</Box>
	);
};

export default EditCouponPage;
