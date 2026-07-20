export interface IBackgroundDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface IBackground {
	id: string;
	name: string;
	source: string;
	skillProficiencies: string[] | null;
	toolProficiencies: string[] | null;
	languages: string[] | null;
	startingGold: number | null;
	featureName: string | null;
	featureDescription: IBackgroundDescription | null;
	suggestedTraits: string[] | null;
	suggestedIdeals: string[] | null;
	suggestedBonds: string[] | null;
	suggestedFlaws: string[] | null;
	page: number | null;
	createdAt: string;
}

export interface IBackgroundFilter {
	q?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
