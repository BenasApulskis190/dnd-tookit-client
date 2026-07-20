import { itemsApi } from "@/Module/Items/api/itemsApi";
import type { IItemFilter } from "@/Module/Items/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useItemStore = defineStore("itemStore", () => {
	const filter = reactive<IItemFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["items", filter],
		queryFn: () => itemsApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});
