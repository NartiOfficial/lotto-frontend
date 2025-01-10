import "../app/globals.css";
import { AuthProvider } from "../contexts/AuthContext";
import Navbar from "../app/components/Layout/Navbar";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body>
				<AuthProvider>
					<Navbar />
					<main>{children}</main>
				</AuthProvider>
			</body>
		</html>
	);
}
