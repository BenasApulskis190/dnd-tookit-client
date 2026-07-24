import { conditionsApi } from "@/Module/Conditions/api/conditionsApi";
import type { IConditionFilter } from "@/Module/Conditions/types";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useConditionStore = defineStore("conditionStore", () => {
	const filter = reactive<IConditionFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isFetching, isError, error } = useQuery({
		queryKey: ["conditions", filter],
		queryFn: () => conditionsApi.getAll(filter),
		// Keep the previous page on screen while the next one loads, so the table
		// shows skeleton rows instead of unmounting and flashing empty.
		placeholderData: keepPreviousData,
	});

	return { filter, data, isLoading, isFetching, isError, error };
});
