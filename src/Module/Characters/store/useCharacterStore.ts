import { charactersApi } from "@/Module/Characters/api/charactersApi";
import type { ICharacterPayload } from "@/Module/Characters/types";
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

export const useCharacterStore = defineStore("characterStore", () => {
	const queryClient = useQueryClient();
	const userStore = useUserStore();
	const isLoggedIn = computed(() => userStore.isLoggedIn);

	// These endpoints require a logged-in user, so don't fire both fetches
	// while logged out — otherwise the 401 (silently resolved to an
	// AxiosError by charactersApi) gets cached as "no characters".

	// The full roster, for the Characters page.
	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["characters", "all"],
		queryFn: () => charactersApi.getAll(),
		enabled: isLoggedIn,
		placeholderData: keepPreviousData,
	});

	// Just the unassigned pool, for the "add existing character" pickers on
	// the Parties page — kept separate so that page doesn't pull every
	// character (with a party already) into its query.
	const { data: unassignedData, isLoading: unassignedIsLoading } = useQuery({
		queryKey: ["characters", "unassigned"],
		queryFn: () => charactersApi.getAll({ unassigned: true }),
		enabled: isLoggedIn,
		placeholderData: keepPreviousData,
	});

	function invalidate() {
		return Promise.all([
			queryClient.invalidateQueries({ queryKey: ["characters"] }),
			queryClient.invalidateQueries({ queryKey: ["parties"] }),
		]);
	}

	async function create(payload: ICharacterPayload) {
		const result = await charactersApi.create(payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to create character"));

		await invalidate();
		return result;
	}

	async function update(id: string, payload: Partial<ICharacterPayload>) {
		const result = await charactersApi.update(id, payload);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to update character"));

		await invalidate();
		return result;
	}

	async function remove(id: string) {
		const result = await charactersApi.remove(id);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Failed to delete character"));

		await invalidate();
	}

	return {
		data,
		isLoading,
		isError,
		error,
		unassignedData,
		unassignedIsLoading,
		create,
		update,
		remove,
	};
});
