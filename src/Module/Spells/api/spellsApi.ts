import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";
import type { ISpell, ISpellFilter } from "@/Module/Spells/types";
import type { AxiosError } from "axios";

export const spellsApi = {
	getAll: (filter?: ISpellFilter) =>
		api
			.get<IPaginatedResponse<ISpell>>("/spells", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getByid: (id: string) =>
		api
			.get<ISpell>(`/spells/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
