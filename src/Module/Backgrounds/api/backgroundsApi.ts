import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { IBackground, IBackgroundFilter } from "@/Module/Backgrounds/types";
import type { AxiosError } from "axios";

export const backgroundsApi = {
	getAll: (filter?: IBackgroundFilter) =>
		api
			.get<IPaginatedResponse<IBackground>>("/backgrounds", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IBackground>(`/backgrounds/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
