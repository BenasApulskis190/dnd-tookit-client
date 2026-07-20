import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { IFeat, IFeatFilter } from "@/Module/Feats/types";
import type { AxiosError } from "axios";

export const featsApi = {
	getAll: (filter?: IFeatFilter) =>
		api
			.get<IPaginatedResponse<IFeat>>("/feats", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IFeat>(`/feats/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
