import { spellsApi } from "@/Module/Spells/api/spellsApi";
import type { ISpellFilter } from "@/Module/Spells/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useSpellStore = defineStore("spellStore", () => {
	const filter = reactive<ISpellFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["spells", filter],
		queryFn: () => spellsApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});
