import { mapsApi } from "@/Module/Maps/api/mapsApi";
import type { IMapFilter } from "@/Module/Maps/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useMapStore = defineStore("mapStore", () => {
	// Maps are browsed as image cards, so a page holds more than the 20 rows a
	// table would.
	const filter = reactive<IMapFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 24,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["maps", filter],
		queryFn: () => mapsApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the grid
		// doesn't unmount and flash empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
