import { conditionsApi } from "@/Module/Conditions/api/conditionsApi";
import type { IConditionFilter } from "@/Module/Conditions/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useConditionStore = defineStore("conditionStore", () => {
	const filter = reactive<IConditionFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["conditions", filter],
		queryFn: () => conditionsApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});
