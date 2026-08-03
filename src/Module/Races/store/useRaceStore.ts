import { racesApi } from "@/Module/Races/api/racesApi";
import type { IRaceFilter } from "@/Module/Races/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useRaceStore = defineStore("raceStore", () => {
	const filter = reactive<IRaceFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["races", filter],
		queryFn: () => racesApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
