import { api } from "@/api/client";

export const monsterTypeApi = {
	getAll: () => {
		return api.get("/monster-types").then((r) => r.data);
	},
	getById: (id: string) => {
		return api.get(`/monster-type/${id}`).then((r) => r.data);
	},
};
