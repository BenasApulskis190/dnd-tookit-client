/**
 * Server-relative paths (e.g. the `/api/images/...` refs on adventure sections
 * and NPC tokens) resolve against the API origin, not the client's — same
 * hardcoded `api.dev` host `src/api/client.ts` and `monsterImageResolver.ts`
 * already assume.
 */
export function resolveApiUrl(path: string | null | undefined): string | null {
	if (!path) return null;
	if (/^https?:\/\//.test(path)) return path;
	return `http://api.dev${path.startsWith("/") ? path : `/${path}`}`;
}
