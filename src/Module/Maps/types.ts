import type { IAdventureMapPin } from "@/Module/Adventures/types";

export interface IMapAdventureRef {
	id: string;
	code: string;
	name: string;
}

export interface IMapSectionRef {
	id: string;
	ordinal: number;
	name: string;
}

/**
 * A map as `GET /maps` returns it: the same shape the adventure detail nests
 * under its sections, plus the section/adventure it belongs to lifted up so the
 * map can stand on its own in a flat list.
 */
export interface IMap {
	id: string;
	name: string;
	imagePath: string;
	imageUrl: string;
	ordinal: number;
	pins: IAdventureMapPin[];
	section: IMapSectionRef;
	adventure: IMapAdventureRef;
}

export type IMapDetail = IMap;

export interface IMapFilter {
	q?: string;
	adventure?: string;
	page?: number;
	limit?: number;
}
