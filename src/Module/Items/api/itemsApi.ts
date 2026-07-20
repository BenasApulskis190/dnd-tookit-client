import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { IItem, IItemFilter } from "@/Module/Items/types";
import type { AxiosError } from "axios";

export const itemsApi = {
	getAll: (filter?: IItemFilter) =>
		api
			.get<IPaginatedResponse<IItem>>("/items", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IItem>(`/items/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
