import { api } from "@/api/client";
import type { ICharacter, ICharacterFilter, ICharacterPayload } from "@/Module/Characters/types";
import type { AxiosError } from "axios";

export const charactersApi = {
	getAll: (filter?: ICharacterFilter) =>
		api
			.get<{ data: ICharacter[] }>("/characters", { params: filter })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<ICharacter>(`/characters/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	create: (payload: ICharacterPayload) =>
		api
			.post<ICharacter>("/characters", payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	update: (id: string, payload: Partial<ICharacterPayload>) =>
		api
			.patch<ICharacter>(`/characters/${id}`, payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	remove: (id: string) =>
		api
			.delete(`/characters/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
