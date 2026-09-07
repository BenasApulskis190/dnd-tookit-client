import { api } from "@/api/client";
import type { AxiosError } from "axios";
import type {
	IAuthResponse,
	ILoginCredentials,
	IRegisterCredentials,
	IUser,
} from "@/Module/Profile/types";

export const profileApi = {
	login: (credentials: ILoginCredentials) =>
		api
			.post<IAuthResponse>("/auth/login", credentials)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	register: (credentials: IRegisterCredentials) =>
		api
			.post<IAuthResponse>("/auth/register", credentials)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	loginWithGoogle: (idToken: string) =>
		api
			.post<IAuthResponse>("/auth/google", { idToken })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	refresh: () =>
		api
			.post<IAuthResponse>("/auth/refresh")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	logout: () =>
		api
			.post("/auth/logout")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getCurrentUser: () =>
		api
			.get<IUser>("/auth/me")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
