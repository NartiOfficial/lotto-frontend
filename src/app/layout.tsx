import "../app/globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../app/components/Layout/Navbar";
import Footer from "./components/Layout/Footer";

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
						<div className='flex flex-col min-h-screen'>
							<Navbar />
							<main className='flex-grow'>{children}</main>
							<Footer />
						</div>
					</div>
				</AuthProvider>
			</body>
		</html>
	);
}
