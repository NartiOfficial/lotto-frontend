import "../app/globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../app/components/Layout/Navbar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='pl'>
			<body>
				<AuthProvider>
					<div className='bg-gradient-to-r from-blue-600 to-indigo-700 min-h-screen text-white'>
						<Navbar />
						<main>{children}</main>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
