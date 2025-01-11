"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import api from "../../services/api";

interface RegisterFormInputs {
	name: string;
	email: string;
	password: string;
	password_confirmation: string;
}

const RegisterForm: React.FC = () => {
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<RegisterFormInputs>();

	const onSubmit = async (data: RegisterFormInputs) => {
		if (data.password !== data.password_confirmation) {
			setError("Hasła muszą być identyczne.");
			return;
		}
		try {
			await api.post("/register", data);
			router.push("/login");
		} catch (err) {
			setError("Rejestracja nie powiodła się. Sprawdź dane.");
		}
	};

	return (
		<div className='min-h-screen flex justify-center items-center bg-gray-100'>
			<div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-lg'>
				<h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>
					Zarejestruj się
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div>
						<label
							htmlFor='name'
							className='block text-sm font-medium text-gray-700'>
							Nazwa użytkownika
						</label>
						<input
							{...register("name", {
								required: "Nazwa użytkownika jest wymagana",
							})}
							type='text'
							id='name'
							className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400'
							placeholder='Podaj swoją nazwę użytkownika'
						/>
						{errors.name && (
							<p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>
						)}
					</div>

					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>
						<input
							{...register("email", {
								required: "Email jest wymagany",
								pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
							})}
							type='email'
							id='email'
							className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400'
							placeholder='Podaj swój email'
						/>
						{errors.email && (
							<p className='text-red-500 text-sm mt-1'>
								Podaj poprawny adres email
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-gray-700'>
							Hasło
						</label>
						<input
							{...register("password", {
								required: "Hasło jest wymagane",
								minLength: {
									value: 8,
									message: "Hasło musi mieć co najmniej 8 znaków",
								},
							})}
							type='password'
							id='password'
							className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400'
							placeholder='Podaj swoje hasło'
						/>
						{errors.password && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.password.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='password_confirmation'
							className='block text-sm font-medium text-gray-700'>
							Potwierdź hasło
						</label>
						<input
							{...register("password_confirmation", {
								required: "Potwierdzenie hasła jest wymagane",
							})}
							type='password'
							id='password_confirmation'
							className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400'
							placeholder='Powtórz hasło'
						/>
						{errors.password_confirmation && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.password_confirmation.message}
							</p>
						)}
					</div>

					{error && (
						<div className='text-red-500 text-center text-sm'>{error}</div>
					)}

					<button
						type='submit'
						className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200'>
						Zarejestruj się
					</button>

					<p className='text-sm text-center text-gray-600 mt-4'>
						Masz już konto?{" "}
						<a
							href='/login'
							className='text-blue-500 hover:text-blue-700 underline transition duration-200'>
							Zaloguj się
						</a>
					</p>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;
