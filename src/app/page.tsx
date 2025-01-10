import React from "react";
import Link from "next/link";

const Home: React.FC = () => {
	return (
		<div className='container mx-auto p-4'>
			<h1 className='text-2xl font-bold'>Welcome to the Lotto API Frontend</h1>
			<Link href='/login' className='text-blue-500 mr-4'>
				Login
			</Link>
			<Link href='/register' className='text-blue-500'>
				Register
			</Link>
		</div>
	);
};

export default Home;
