import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type {
	IClass,
	IClassDetail,
	IClassFilter,
} from "@/Module/Classes/types";
import type { AxiosError } from "axios";

export const classesApi = {
	getAll: (filter?: IClassFilter) =>
		api
			.get<IPaginatedResponse<IClass>>("/classes", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IClassDetail>(`/classes/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
