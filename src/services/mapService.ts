// TODO: replace with API call to GET /maps and GET /maps/:id/adventure-data

export interface LocationEntry {
	text: string[]
	readaloud: string[]
}

export interface MapPin {
	entryName: string
	x: number
	y: number
}

export interface ResolvedPin extends MapPin {
	title: string
	text: string[]
	readaloud: string[]
}

export interface ResolvedMap {
	id: string
	name: string
	imageUrl: string
	pins: ResolvedPin[]
}

export function getResolvedMaps(): ResolvedMap[] {
	// TODO: fetch map definitions from GET /maps and adventure data from GET /maps/:id/adventure-data
	return []
}
