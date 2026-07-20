import { featsApi } from "@/Module/Feats/api/featsApi";
import type { IFeatFilter } from "@/Module/Feats/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useFeatStore = defineStore("featStore", () => {
	const filter = reactive<IFeatFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["feats", filter],
		queryFn: () => featsApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});
