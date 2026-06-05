import { defineStore } from "pinia";
import { reactive } from "vue";
import { useQuery } from "@tanstack/vue-query";
import { monstersApi } from "@/Module/Bestiary/api/monsterApi";
import type { IMonsterFilter } from "@/Module/Bestiary/types";

export const useMonsterStore = defineStore("monsterStore", () => {
	const filter = reactive<IMonsterFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["monsters", filter],
		queryFn: () => monstersApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});