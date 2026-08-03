import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type {
	IAdventure,
	IAdventureDetail,
	IAdventureFilter,
	IAdventureSection,
} from "@/Module/Adventures/types";
import type { AxiosError } from "axios";

export const adventuresApi = {
	getAll: (filter?: IAdventureFilter) =>
		api
			.get<IPaginatedResponse<IAdventure>>("/adventures", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	// `idOrCode` accepts either the adventure's UUID or its short code (e.g. "LMoP").
	getByIdOrCode: (idOrCode: string) =>
		api
			.get<IAdventureDetail>(`/adventures/${idOrCode}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getSection: (idOrCode: string, ordinal: number) =>
		api
			.get<IAdventureSection>(`/adventures/${idOrCode}/sections/${ordinal}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
