"use client";

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../contexts/AuthContext";
import api from "../../../services/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Coupon {
	id: number;
	drawDate: string;
	numbers: number[];
	result: string | null;
}

const UserDashboard: React.FC = () => {
	return (
		<div className='container mx-auto p-6'>
			<div className='flex justify-between items-center bg-gradient-to-r from-blue-500 to-indigo-500 p-6 rounded-lg shadow-md mb-6 text-white'>
				<h1 className='text-3xl font-bold'>Witaj</h1>
				<button
					className='bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md'>
					Wyloguj się
				</button>
			</div>

			<Link
				href='/coupons/purchase'
				className='bg-blue-600 text-white px-4 py-2 rounded-lg'>
				Zakup Kupon
			</Link>

			<div className='bg-white p-6 rounded-lg shadow-md'>
				<h2 className='text-2xl font-semibold mb-4 text-gray-800'>
					Twoje kupony
				</h2>
			</div>
		</div>
	);
};

export default UserDashboard;
