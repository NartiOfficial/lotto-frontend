"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../../../contexts/AuthContext";
import { useRouter } from "next/navigation";

const Navbar: React.FC = () => {
	const { user, logout } = useContext(AuthContext)!;
	const router = useRouter();

	const handleLogout = async () => {
		await logout();
		router.push("/login");
	};

	return (
		<nav className='bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg'>
			<div className='container mx-auto flex justify-between items-center p-4'>
				<div className='flex items-center space-x-6'>
					<Link
						href='/'
						className='text-3xl font-extrabold text-white hover:text-yellow-300 transition duration-300'>
						Lotto
					</Link>
					{user && (
						<>
							<Link
								href='/dashboard'
								className='text-white hover:text-yellow-300 transition duration-300'>
								Panel użytkownika
							</Link>
							{user.role === "admin" && (
								<Link
									href='/admin'
									className='text-white hover:text-yellow-300 transition duration-300'>
									Admin Panel
								</Link>
							)}
						</>
					)}
				</div>

				<div className='flex items-center space-x-4'>
					{user ? (
						<>
							<span className='text-white font-medium'>
								Witaj, <strong className='text-yellow-300'>{user.name}</strong>
							</span>
							<button
								onClick={handleLogout}
								className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-300'>
								Wyloguj się
							</button>
						</>
					) : (
						<>
							<Link
								href='/login'
								className='text-white hover:text-yellow-300 transition duration-300'>
								Zaloguj się
							</Link>
							<Link
								href='/register'
								className='bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold transition duration-300'>
								Zarejestruj się
							</Link>
						</>
					)}
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
