import { classesApi } from "@/Module/Classes/api/classesApi";
import type { IClassFilter } from "@/Module/Classes/types";
import { useQuery } from "@tanstack/vue-query";
import { defineStore } from "pinia";
import { reactive } from "vue";

export const useClassStore = defineStore("classStore", () => {
	const filter = reactive<IClassFilter & { page: number; limit: number }>({
		q: "",
		page: 1,
		limit: 20,
	});

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ["classes", filter],
		queryFn: () => classesApi.getAll(filter),
	});

	return { filter, data, isLoading, isError, error };
});
