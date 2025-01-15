"use client";

import React, { createContext, useState, useEffect } from "react";
import api from "../services/api";

interface User {
	id: number;
	name: string;
	email: string;
	role: "user" | "admin";
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

	const login = async (email: string, password: string) => {
		const response = await api.post("/login", { email, password });
		const token = response.data.token;

		sessionStorage.setItem("authToken", token);
		setUser(response.data.user);
	};

	const logout = async () => {
		try {
			await api.post("/logout");
		} catch (error) {
			console.error("Błąd podczas wylogowania:", error);
		} finally {
			sessionStorage.removeItem("authToken");
			setUser(null);
		}
	};

	useEffect(() => {
		const storedToken = sessionStorage.getItem("authToken");
		if (storedToken) {
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

	return (
		<AuthContext.Provider value={{ user, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};
