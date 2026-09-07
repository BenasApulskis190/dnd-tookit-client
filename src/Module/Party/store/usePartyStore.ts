import { partyApi } from "@/Module/Party/api/partyApi";
import type { IPartyPayload } from "@/Module/Party/types";
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

export const usePartyStore = defineStore("partyStore", () => {
	const queryClient = useQueryClient();
	const userStore = useUserStore();

	// These endpoints require a logged-in user, so don't fire while logged
	// out — otherwise the 401 (silently resolved to an AxiosError by
	// partyApi) gets cached as "no parties".
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["parties"],
		queryFn: () => partyApi.getAll(),
		enabled: computed(() => userStore.isLoggedIn),
		placeholderData: keepPreviousData,
	});

	function invalidate() {
		return Promise.all([
			queryClient.invalidateQueries({ queryKey: ["parties"] }),
			queryClient.invalidateQueries({ queryKey: ["characters"] }),
		]);
	}

	async function create(payload: IPartyPayload) {
		const result = await partyApi.create(payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to create party"));

		await invalidate();
		return result;
	}

	async function remove(id: string) {
		const result = await partyApi.remove(id);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to delete party"));

		await invalidate();
	}

	async function addCharacter(partyId: string, characterId: string) {
		const result = await partyApi.addCharacter(partyId, characterId);
		if (isAxiosError(result))
			throw new Error(errorMessage(result, "Failed to add character to party"));

		await invalidate();
	}

	async function removeCharacter(partyId: string, characterId: string) {
		const result = await partyApi.removeCharacter(partyId, characterId);
		if (isAxiosError(result))
			throw new Error(errorMessage(result, "Failed to remove character from party"));

		await invalidate();
	}

	return { data, isLoading, isError, error, create, remove, addCharacter, removeCharacter };
});
