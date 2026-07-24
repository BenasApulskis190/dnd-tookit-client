import { itemsApi } from "@/Module/Items/api/itemsApi";
import type { IItemFilter } from "@/Module/Items/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useItemStore = defineStore("itemStore", () => {
	const filter = reactive<IItemFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["items", filter],
		queryFn: () => itemsApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
