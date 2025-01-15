"use client";

import React from "react";

const Footer: React.FC = () => {
	return (
		<footer className='bg-gray-800 text-white text-center py-4'>
			<p className='text-sm'>
				&copy; {new Date().getFullYear()} Jakub Wielgocki. Nr indeksu: 33501.
			</p>
			<p className='text-xs mt-1'>
				Wszelkie prawa zastrzeżone. Strona stworzona do wykonania projektu.
			</p>
		</footer>
	);
};

export default Footer;
