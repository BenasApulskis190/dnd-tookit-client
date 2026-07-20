import { backgroundsApi } from "@/Module/Backgrounds/api/backgroundsApi";
import type { IBackgroundFilter } from "@/Module/Backgrounds/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useBackgroundStore = defineStore("backgroundStore", () => {
	const filter = reactive<IBackgroundFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["backgrounds", filter],
		queryFn: () => backgroundsApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});
