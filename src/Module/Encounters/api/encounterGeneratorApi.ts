import { api } from "@/api/client";
import type { IPaginatedResponse } from "@/Module/Pagination/types";

export interface IGeneratorMonster {
	id: string;
	name: string;
	source: string;
	challengeRating: string;
	crValue: number | null;
}

export const encounterGeneratorApi = {
	// Search by name and keep only exact (case-insensitive) matches, MM first,
	// since the search is fuzzy and also returns homebrew/3pp lookalikes.
	findByName: async (name: string): Promise<IGeneratorMonster | null> => {
		try {
			const { data } = await api.get<IPaginatedResponse<IGeneratorMonster>>("/monsters", {
				params: { q: name, limit: 20 },
			});
			const exact = data.data.filter((m) => m.name.toLowerCase() === name.toLowerCase());
			return exact.find((m) => m.source === "MM") ?? exact[0] ?? null;
		} catch {
			return null;
		}
	},
};
