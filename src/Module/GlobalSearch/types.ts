import type { IndexName } from "@/Module/GlobalSearch/indices";

export interface IGlobalSearchFilter {
	q?: string;
	page?: number;
	limit?: number;
}

/**
 * A single hit from the cross-index `/search` endpoint. The API spreads the
 * indexed document and adds `_index`/`_score`, so every hit has at least an id
 * and name plus arbitrary entity-specific fields.
 */
export interface IGlobalSearchHit {
	id: string;
	name: string;
	source?: string;
	type?: string;
	_index: IndexName;
	_score: number;
	[key: string]: unknown;
}

export interface IGlobalSearchResponse {
	query: string;
	data: IGlobalSearchHit[];
	pagination: {
		total: number;
		page: number;
		limit: number;
	};
}
