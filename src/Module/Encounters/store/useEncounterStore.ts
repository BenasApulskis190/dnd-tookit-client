import { encountersApi } from "@/Module/Encounters/api/encountersApi";
import type { IEncounterLootPayload, IEncounterPayload } from "@/Module/Encounters/types";
import { useUserStore } from "@/Module/User/store/useUserStore";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/vue-query";
import { isAxiosError } from "axios";
import { defineStore } from "pinia";
import { computed } from "vue";

function errorMessage(result: unknown, fallback: string): string {
	if (isAxiosError(result)) {
		return (result.response?.data as { error?: string } | undefined)?.error ?? fallback;
	}
	return fallback;
}

export const useEncounterStore = defineStore("encounterStore", () => {
	const queryClient = useQueryClient();
	const userStore = useUserStore();

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["encounters"],
		queryFn: () => encountersApi.getAll(),
		enabled: computed(() => userStore.isLoggedIn),
		placeholderData: keepPreviousData,
	});

	function invalidate() {
		return queryClient.invalidateQueries({ queryKey: ["encounters"] });
	}

	async function create(payload: IEncounterPayload) {
		const result = await encountersApi.create(payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to create encounter"));

		await invalidate();
		return result;
	}

	async function update(id: string, payload: Partial<IEncounterPayload>) {
		const result = await encountersApi.update(id, payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to update encounter"));

		await invalidate();
		return result;
	}

	async function remove(id: string) {
		const result = await encountersApi.remove(id);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to delete encounter"));

		await invalidate();
	}

	async function addMonster(encounterId: string, monsterId: string, quantity = 1) {
		const result = await encountersApi.addMonster(encounterId, monsterId, quantity);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to add monster"));

		await invalidate();
		return result;
	}

	async function updateMonster(encounterId: string, monsterId: string, quantity: number) {
		const result = await encountersApi.updateMonster(encounterId, monsterId, quantity);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to update monster quantity"));

		await invalidate();
		return result;
	}

	async function removeMonster(encounterId: string, monsterId: string) {
		const result = await encountersApi.removeMonster(encounterId, monsterId);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to remove monster"));

		await invalidate();
	}

	async function addLoot(encounterId: string, payload: IEncounterLootPayload) {
		const result = await encountersApi.addLoot(encounterId, payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to add loot"));

		await invalidate();
		return result;
	}

	async function updateLoot(encounterId: string, lootId: string, payload: Partial<IEncounterLootPayload>) {
		const result = await encountersApi.updateLoot(encounterId, lootId, payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to update loot"));

		await invalidate();
		return result;
	}

	async function removeLoot(encounterId: string, lootId: string) {
		const result = await encountersApi.removeLoot(encounterId, lootId);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to remove loot"));

		await invalidate();
	}

	return {
		data,
		isLoading,
		isError,
		error,
		create,
		update,
		remove,
		addMonster,
		updateMonster,
		removeMonster,
		addLoot,
		updateLoot,
		removeLoot,
	};
});
