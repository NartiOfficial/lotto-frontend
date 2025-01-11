"use client";

import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

interface User {
	id: number;
	name: string;
	email: string;
	role: string;
}

interface AuthContextType {
	user: User | null;
	login: (email: string, password: string) => Promise<void>;
	logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const storedToken = localStorage.getItem("authToken");
		if (storedToken) {
			api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
			fetchUser();
		}
	}, []);

	const fetchUser = async () => {
		try {
			const response = await api.get("/user");
			setUser(response.data);
		} catch {
			logout();
		}
	};

	const login = async (email: string, password: string) => {
		const response = await api.post("/login", { email, password });
		const token = response.data.token;

		localStorage.setItem("authToken", token);
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		setUser(response.data.user);
	};

	const logout = async () => {
		try {
			await api.post("/logout");
		} catch (error) {
			console.error("Błąd podczas wylogowania:", error);
		} finally {
			localStorage.removeItem("authToken");
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
