export interface IBookRef {
	id: string;
	code: string;
	name: string;
}

export interface IAdventureCounts {
	sections: number;
	npcs: number;
}

export interface IAdventure {
	id: string;
	code: string;
	name: string;
	storyline: string | null;
	levelStart: number | null;
	levelEnd: number | null;
	published: string | null;
	bookId: string | null;
	book: IBookRef | null;
	_count: IAdventureCounts;
	createdAt: string;
}

export interface IAdventureImage {
	title: string;
	path: string;
	url: string;
}

export interface IAdventureMapPin {
	id: string;
	label: string;
	entryName: string;
	x: number;
	y: number;
}

export interface IAdventureMap {
	id: string;
	name: string;
	imagePath: string;
	imageUrl: string;
	ordinal: number;
	pins: IAdventureMapPin[];
}

export interface IAdventureSectionSummary {
	id: string;
	ordinal: number;
	name: string;
	headers: unknown;
	images: IAdventureImage[] | null;
	maps: IAdventureMap[];
}

export interface IAdventureNpcSummary {
	id: string;
	name: string;
	source: string;
	tokenUrl: string | null;
	monsterId: string | null;
}

export interface IAdventureDetail extends Omit<IAdventure, "_count"> {
	sections: IAdventureSectionSummary[];
	npcs: IAdventureNpcSummary[];
}

/** Full chapter content, `GET /adventures/:id/sections/:ordinal`. */
export interface IAdventureSection {
	id: string;
	adventureId: string;
	ordinal: number;
	name: string;
	headers: unknown;
	/** Raw nested 5etools entry tree; feed through `normalizeEntries`. */
	entries: unknown;
	images: IAdventureImage[] | null;
	maps: IAdventureMap[];
	adventure: { id: string; code: string; name: string };
}

export interface IAdventureFilter {
	q?: string;
	storyline?: string;
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}
