"use client";

import React, { useContext } from "react";
import Link from "next/link";
import { AuthContext } from "../../../contexts/AuthContext";

const Navbar: React.FC = () => {
	const { user, logout } = useContext(AuthContext)!;

	const handleLogout = async () => {
		await logout();
	};

	return (
		<nav className='bg-gray-800 p-4 text-white'>
			<div className='container mx-auto flex justify-between'>
				<Link href='/'>Home</Link>
				{user ? (
					<>
						<Link href='/dashboard'>Dashboard</Link>
						{user.role === "admin" && <Link href='/admin'>Admin</Link>}
						<button
							onClick={handleLogout}
							className='bg-red-500 px-3 py-1 rounded'>
							Logout
						</button>
					</>
				) : (
					<>
						<Link href='/login'>Login</Link>
						<Link href='/register' className='bg-blue-500 px-3 py-1 rounded'>
							Register
						</Link>
					</>
				)}
			</div>
		</nav>
	);
};

export default Navbar;
