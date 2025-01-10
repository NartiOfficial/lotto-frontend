import React from "react";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import AdminDashboard from "../../components/Dashboard/AdminDashboard";

const AdminPage: React.FC = () => {
	const { user } = useContext(AuthContext);

	if (!user || user.role !== "admin") {
		redirect("/dashboard");
	}

	return <AdminDashboard />;
};

export default AdminPage;
