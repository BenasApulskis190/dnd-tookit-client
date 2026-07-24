import { defineStore } from "pinia";
import { reactive } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { monstersApi } from "@/Module/Bestiary/api/monsterApi";
import type { IMonsterFilter } from "@/Module/Bestiary/types";

export const useMonsterStore = defineStore("monsterStore", () => {
	const filter = reactive<IMonsterFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["monsters", filter],
		queryFn: () => monstersApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});