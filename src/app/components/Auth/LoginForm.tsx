"use client";

import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface LoginFormInputs {
	email: string;
	password: string;
}

const LoginForm: React.FC = () => {
	const { login, user } = useContext(AuthContext)!;
	const router = useRouter();
	const [error, setError] = useState<string | null>(null);
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormInputs>();

	const onSubmit = async (data: LoginFormInputs) => {
		try {
			await login(data.email, data.password);

			if (user?.role === "admin") {
				router.push("/admin");
			} else {
				router.push("/dashboard");
			}
		} catch (error) {
			setError("Nieprawidłowe dane logowania. Spróbuj ponownie.");
		}
	};

	return (
		<div className='h-[807px] flex justify-center items-center bg-gray-100'>
			<div className='bg-white shadow-lg rounded-lg p-8 w-full max-w-md'>
				<h2 className='text-3xl font-bold text-center mb-6 text-gray-800'>
					Zaloguj się
				</h2>
				<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
					<div>
						<label
							htmlFor='email'
							className='block text-sm font-medium text-gray-700'>
							Email
						</label>
						<input
							{...register("email", {
								required: "Email jest wymagany",
								pattern: {
									value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
									message: "Podaj poprawny adres email",
								},
							})}
							type='email'
							id='email'
							className='w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 placeholder:text-gray-400'
							placeholder='Podaj swój email'
						/>
						{errors.email && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.email.message}
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
							{...register("password", { required: "Hasło jest wymagane" })}
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

					{error && (
						<div className='text-red-500 text-center text-sm'>{error}</div>
					)}

					<button
						type='submit'
						className='w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition duration-200'>
						Zaloguj się
					</button>

					<p className='text-sm text-center text-gray-600 mt-4'>
						Nie masz konta?{" "}
						<Link
							href='/register'
							className='text-blue-500 hover:text-blue-700 underline'>
							Zarejestruj się
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
};

export default LoginForm;
