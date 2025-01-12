"use client";

import React, { useContext } from "react";
import { redirect } from "next/navigation";
import { AuthContext } from "../../contexts/AuthContext";
import UserDashboard from "../components/Dashboard/UserDashboard";

const DashboardPage: React.FC = () => {
	const { user } = useContext(AuthContext) || {};

	if (!user) {
		redirect("/login");
	}

	return <UserDashboard />;
};

export default DashboardPage;
