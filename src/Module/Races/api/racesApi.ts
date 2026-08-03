import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { IRace, IRaceFilter } from "@/Module/Races/types";
import type { AxiosError } from "axios";

export const racesApi = {
	getAll: (filter?: IRaceFilter) =>
		api
			.get<IPaginatedResponse<IRace>>("/races", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IRace>(`/races/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
