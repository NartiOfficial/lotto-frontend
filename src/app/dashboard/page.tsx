"use client";

import React from "react";
import { redirect } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import UserDashboard from "../components/Dashboard/UserDashboard";

const DashboardPage: React.FC = () => {
	const { user } = useContext(AuthContext);

	if (!user) {
		redirect("/login");
	}

	return <UserDashboard />;
};

export default DashboardPage;
