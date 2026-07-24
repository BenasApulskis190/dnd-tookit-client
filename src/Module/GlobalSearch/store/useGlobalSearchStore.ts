import { globalSearchApi } from "@/Module/GlobalSearch/api/globalSearchApi";
import type { IGlobalSearchFilter } from "@/Module/GlobalSearch/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

export const useGlobalSearchStore = defineStore("globalSearchStore", () => {
	const filter = reactive<IGlobalSearchFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 30,
	});

	// The API rejects empty queries with 400, so only fetch once there's a term.
	const enabled = computed(() => (filter.q ?? "").trim().length > 0);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["globalSearch", filter],
		queryFn: () => globalSearchApi.search(filter),
		enabled,
		placeholderData: (prev) => prev,
	});

	function reset() {
		filter.q = "";
		filter.page = 1;
	}

	return { filter, data, isLoading, isError, error, reset };
});
