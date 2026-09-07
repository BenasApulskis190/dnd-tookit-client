import { api } from "@/api/client";
import type { IParty, IPartyPayload } from "@/Module/Party/types";
import type { AxiosError } from "axios";

export const partyApi = {
	getAll: () =>
		api
			.get<{ data: IParty[] }>("/parties")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IParty>(`/parties/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	create: (payload: IPartyPayload) =>
		api
			.post<IParty>("/parties", payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	update: (id: string, payload: Partial<IPartyPayload>) =>
		api
			.patch<IParty>(`/parties/${id}`, payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	remove: (id: string) =>
		api
			.delete(`/parties/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	addCharacter: (partyId: string, characterId: string) =>
		api
			.post<IParty>(`/parties/${partyId}/characters/${characterId}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	removeCharacter: (partyId: string, characterId: string) =>
		api
			.delete<IParty>(`/parties/${partyId}/characters/${characterId}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
