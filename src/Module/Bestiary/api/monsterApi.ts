import { api } from "@/api/client";

import type {
	ICreateMonsterDto,
	IMonsterFilter,
	IUpdateMonsterDto,
} from "@/Module/Bestiary/types";
import type { Monster } from "@/Module/EncounterManager/types";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { AxiosError } from "axios";

export const monstersApi = {
	getAll: (filter?: IMonsterFilter) =>
		api
			.get<IPaginatedResponse<Monster>>("/monsters", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api.get<Monster>(`/monsters/${id}`).then((r) => r.data),

	create: (data: ICreateMonsterDto) =>
		api.post<Monster>("/monsters", data).then((r) => r.data),

	update: (id: string, data: IUpdateMonsterDto) =>
		api.patch<Monster>(`/monsters/${id}`, data).then((r) => r.data),

	delete: (id: string) => api.delete(`/monsters/${id}`),
};
