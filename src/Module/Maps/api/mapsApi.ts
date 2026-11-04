import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { IMap, IMapDetail, IMapFilter } from "@/Module/Maps/types";
import type { AxiosError } from "axios";

export const mapsApi = {
	getAll: (filter?: IMapFilter) =>
		api
			.get<IPaginatedResponse<IMap>>("/maps", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IMapDetail>(`/maps/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
