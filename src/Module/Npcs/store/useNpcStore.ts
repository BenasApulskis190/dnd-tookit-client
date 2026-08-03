import { npcsApi } from "@/Module/Npcs/api/npcsApi";
import type { INpcFilter } from "@/Module/Npcs/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useNpcStore = defineStore("npcStore", () => {
	const filter = reactive<INpcFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["npcs", filter],
		queryFn: () => npcsApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
