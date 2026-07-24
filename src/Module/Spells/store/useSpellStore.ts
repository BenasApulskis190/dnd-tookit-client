import { spellsApi } from "@/Module/Spells/api/spellsApi";
import type { ISpellFilter } from "@/Module/Spells/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useSpellStore = defineStore("spellStore", () => {
	const filter = reactive<ISpellFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["spells", filter],
		queryFn: () => spellsApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
