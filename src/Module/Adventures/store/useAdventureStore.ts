import { adventuresApi } from "@/Module/Adventures/api/adventuresApi";
import type { IAdventureFilter } from "@/Module/Adventures/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAdventureStore = defineStore("adventureStore", () => {
	const filter = reactive<IAdventureFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["adventures", filter],
		queryFn: () => adventuresApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
