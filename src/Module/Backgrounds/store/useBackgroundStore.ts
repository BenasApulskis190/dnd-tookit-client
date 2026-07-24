import { backgroundsApi } from "@/Module/Backgrounds/api/backgroundsApi";
import type { IBackgroundFilter } from "@/Module/Backgrounds/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useBackgroundStore = defineStore("backgroundStore", () => {
	const filter = reactive<IBackgroundFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["backgrounds", filter],
		queryFn: () => backgroundsApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
