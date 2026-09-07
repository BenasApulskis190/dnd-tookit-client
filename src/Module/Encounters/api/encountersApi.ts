import { api } from "@/api/client";
import type { IEncounter, IEncounterLootPayload, IEncounterPayload } from "@/Module/Encounters/types";
import type { AxiosError } from "axios";

export const encountersApi = {
	getAll: () =>
		api
			.get<{ data: IEncounter[] }>("/encounters")
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	getById: (id: string) =>
		api
			.get<IEncounter>(`/encounters/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	create: (payload: IEncounterPayload) =>
		api
			.post<IEncounter>("/encounters", payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	update: (id: string, payload: Partial<IEncounterPayload>) =>
		api
			.patch<IEncounter>(`/encounters/${id}`, payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	remove: (id: string) =>
		api
			.delete(`/encounters/${id}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	addMonster: (encounterId: string, monsterId: string, quantity = 1) =>
		api
			.post<IEncounter>(`/encounters/${encounterId}/monsters`, { monsterId, quantity })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	updateMonster: (encounterId: string, monsterId: string, quantity: number) =>
		api
			.patch<IEncounter>(`/encounters/${encounterId}/monsters/${monsterId}`, { quantity })
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	removeMonster: (encounterId: string, monsterId: string) =>
		api
			.delete<IEncounter>(`/encounters/${encounterId}/monsters/${monsterId}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	addLoot: (encounterId: string, payload: IEncounterLootPayload) =>
		api
			.post<IEncounter>(`/encounters/${encounterId}/loot`, payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	updateLoot: (encounterId: string, lootId: string, payload: Partial<IEncounterLootPayload>) =>
		api
			.patch<IEncounter>(`/encounters/${encounterId}/loot/${lootId}`, payload)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),

	removeLoot: (encounterId: string, lootId: string) =>
		api
			.delete<IEncounter>(`/encounters/${encounterId}/loot/${lootId}`)
			.then((r) => r.data)
			.catch((e: AxiosError) => e),
};
