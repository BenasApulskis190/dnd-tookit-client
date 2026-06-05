import axios from "axios";

export const api = axios.create({
	// baseURL: import.meta.env.VITE_API_URL || "/api",
	baseURL: 'http://api.dev/api' || "/api",
	headers: {
		"Content-Type": "application/json",
	},
});
