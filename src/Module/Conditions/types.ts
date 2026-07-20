export interface IConditionDescription {
	entries: (string | Record<string, unknown>)[];
}

export interface ICondition {
	id: string;
	name: string;
	source: string;
	description: IConditionDescription;
	page: number | null;
	createdAt: string;
}

export interface IConditionFilter {
	q?: string;
	source?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
