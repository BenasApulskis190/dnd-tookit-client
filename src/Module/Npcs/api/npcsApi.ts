import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { INpc, INpcDetail, INpcFilter } from "@/Module/Npcs/types";
import type { AxiosError } from "axios";

export const npcsApi = {
	getAll: (filter?: INpcFilter) =>
		api
			.get<IPaginatedResponse<INpc>>("/npcs", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<INpcDetail>(`/npcs/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
