"use client";

import React, { useState, useEffect } from "react";
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
	Checkbox,
	ListItemText,
	List,
	ListItem,
	SelectChangeEvent,
} from "@mui/material";
import api from "../../../services/api";

interface Draw {
	id: number;
	draw_date: string;
}

const CreateCouponPage: React.FC = () => {
	const [numbers, setNumbers] = useState<number[]>([]);
	const [drawIds, setDrawIds] = useState<number[]>([]);
	const [availableDraws, setAvailableDraws] = useState<Draw[]>([]);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);
	const [successMessage, setSuccessMessage] = useState<string | null>(null);
	const [inputValue, setInputValue] = useState<string>("");

	useEffect(() => {
		const fetchAvailableDraws = async () => {
			try {
				const response = await api.get("/draws");
				const futureDraws = response.data.filter(
					(draw: Draw) => new Date(draw.draw_date) >= new Date()
				);
				setAvailableDraws(futureDraws);
			} catch {
				setErrorMessage("Nie udało się pobrać losowań.");
			}
		};
		fetchAvailableDraws();
	}, []);

	const handleChangeNumbers = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value;
		if (/^\d{0,2}$/.test(value)) {
			setInputValue(value);
		}
	};

	const handleAddNumber = () => {
		const value = Number(inputValue);
		if (value >= 1 && value <= 49 && !numbers.includes(value)) {
			setNumbers([...numbers, value]);
		}
		setInputValue("");
	};

	const handleRemoveNumber = (number: number) => {
		setNumbers(numbers.filter((n) => n !== number));
	};

	const handleChangeDraws = (event: SelectChangeEvent<number[]>) => {
		setDrawIds(event.target.value as number[]);
	};

	const handleSubmit = async () => {
		if (numbers.length !== 6) {
			setErrorMessage("Musisz wybrać dokładnie 6 liczb.");
			return;
		}
		if (drawIds.length === 0) {
			setErrorMessage(
				"Musisz przypisać kupon do co najmniej jednego losowania."
			);
			return;
		}

		try {
			const response = await api.post("/coupons", {
				numbers,
				draw_ids: drawIds,
			});
			setSuccessMessage(response.data.message);
			setNumbers([]);
			setDrawIds([]);
		} catch {
			setErrorMessage("Wystąpił problem podczas tworzenia kuponu.");
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
			<Typography variant='h5' className='mb-4 text-black'>
				Stwórz kupon
			</Typography>
			{errorMessage && (
				<Alert severity='error' className='mb-4 text-black'>
					{errorMessage}
				</Alert>
			)}
			{successMessage && (
				<Alert severity='success' className='mb-4 text-black'>
					{successMessage}
				</Alert>
			)}

			<Typography variant='body1' className='mb-4 text-black'>
				Wybierz 6 liczb (od 1 do 49):
			</Typography>
			<Box>
				<TextField
					label='Wybierz liczbę'
					variant='outlined'
					type='text'
					value={inputValue}
					onChange={handleChangeNumbers}
					onKeyPress={(event) => {
						if (event.key === "Enter") {
							handleAddNumber();
						}
					}}
					sx={{ mb: 2 }}
					className='text-black'
				/>
				<Button onClick={handleAddNumber} variant='outlined' sx={{ ml: 2 }}>
					Dodaj
				</Button>
			</Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant='body1' className='text-black'>
					Wybrane liczby:
				</Typography>
				<List className='text-black'>
					{numbers.map((number) => (
						<ListItem key={number}>
							<ListItemText primary={`Liczba: ${number}`} />
							<Button onClick={() => handleRemoveNumber(number)} color='error'>
								Usuń
							</Button>
						</ListItem>
					))}
				</List>
			</Box>

			<FormControl fullWidth sx={{ mb: 4 }}>
				<InputLabel>Wybierz daty losowań</InputLabel>
				<Select
					multiple
					value={drawIds}
					onChange={handleChangeDraws}
					renderValue={(selected) =>
						selected
							.map((id) =>
								new Date(
									availableDraws.find((draw) => draw.id === id)?.draw_date || ""
								).toLocaleDateString()
							)
							.join(", ")
					}>
					{availableDraws.map((draw) => (
						<MenuItem key={draw.id} value={draw.id}>
							<Checkbox checked={drawIds.includes(draw.id)} />
							<ListItemText
								primary={new Date(draw.draw_date).toLocaleDateString()}
							/>
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<Box sx={{ display: "flex", justifyContent: "flex-end" }}>
				<Button onClick={handleSubmit} variant='contained' color='primary'>
					Stwórz kupon
				</Button>
			</Box>
		</Box>
	);
};

export default CreateCouponPage;
