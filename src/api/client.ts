import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
	// Defaults to a same-origin path so the httpOnly refresh_token cookie is
	// first-party — a cross-site base (http://api.dev/api) makes the browser
	// drop the SameSite=Lax cookie and every silent refresh fails.
	baseURL: import.meta.env.VITE_API_URL || "/api",
	// refresh_token cookie is httpOnly + credentials: true on the API's CORS config
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

// Dynamic import breaks the client <-> user store circular dependency
// (Module/User/store/useUserStore.ts -> Profile/api/profileApi.ts -> this file).
api.interceptors.request.use(async (config) => {
	const { useUserStore } = await import("@/Module/User/store/useUserStore");
	const { accessToken } = useUserStore();
	if (accessToken) {
		config.headers.Authorization = `Bearer ${accessToken}`;
	}
	return config;
});

// A 401 means the access token expired mid-session. Try one silent refresh
// (via the httpOnly refresh cookie) and replay the request; if the refresh
// itself fails, the session really is gone, so clear it and let the
// original 401 propagate to the caller.
api.interceptors.response.use(
	(response) => response,
	async (error: AxiosError) => {
		const config = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
		const isAuthEndpoint = config?.url?.startsWith("/auth/");

		if (error.response?.status !== 401 || !config || config._retried || isAuthEndpoint) {
			throw error;
		}

		const { useUserStore } = await import("@/Module/User/store/useUserStore");
		const userStore = useUserStore();

		const refreshed = await userStore.refresh();
		if (!refreshed) {
			userStore.clearSession();
			throw error;
		}

		config._retried = true;
		config.headers.Authorization = `Bearer ${userStore.accessToken}`;
		return api(config);
	},
);
