import axios from "axios";

const api = axios.create({
	baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost/api",
});

api.interceptors.request.use((config) => {
	const token = sessionStorage.getItem("authToken");
	if (token) {
		config.headers["Authorization"] = `Bearer ${token}`;
		config.headers["Content-Type"] = "application/json";
		config.headers["Accept"] = "application/json";
	}
	console.log(config);
	return config;
});

export default api;
