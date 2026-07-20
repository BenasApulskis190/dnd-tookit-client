import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { ICondition, IConditionFilter } from "@/Module/Conditions/types";
import type { AxiosError } from "axios";

export const conditionsApi = {
	getAll: (filter?: IConditionFilter) =>
		api
			.get<IPaginatedResponse<ICondition>>("/conditions", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<ICondition>(`/conditions/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
