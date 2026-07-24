import { api } from "@/api/client";
import type {
	IGlobalSearchFilter,
	IGlobalSearchResponse,
} from "@/Module/GlobalSearch/types";
import type { AxiosError } from "axios";

export const globalSearchApi = {
	search: (filter: IGlobalSearchFilter) =>
		api
			.get<IGlobalSearchResponse>("/search", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
