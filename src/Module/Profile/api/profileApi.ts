import { api } from "@/api/client";
import type { AxiosError } from "axios";
import type { ILoginCredentials, IUser } from "@/Module/Profile/types";

export const profileApi = {
	// TODO: no backend endpoint yet - wire up once auth API exists
	login: (credentials: ILoginCredentials) =>
		api
			.post<IUser>("/auth/login", credentials)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	// TODO: no backend endpoint yet - wire up once auth API exists
	logout: () =>
		api
			.post("/auth/logout")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	// TODO: no backend endpoint yet - wire up once auth API exists
	getCurrentUser: () =>
		api
			.get<IUser>("/auth/me")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
