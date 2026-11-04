// Random encounter generator.
//
// 1. Pick a setting + theme (each theme lists minions / elites / leaders,
//    each tagged melee, ranged or caster).
// 2. Many times over: pick a composition template ("2–4 minions, 2 elites,
//    1 leader", "a horde and a boss", ...), split the XP budget between its
//    tiers, and pick monsters whose XP fits each tier's share — keeping a
//    clear pecking order (minion < elite < leader) and mixing combat styles.
// 3. Keep the candidates that land in the requested DMG difficulty band,
//    score them for "is this a fun fight" (style mix, a boss that stands out,
//    sane action economy, variety of creatures), and pick among the best.

import {
	encounterGeneratorApi,
	type IGeneratorMonster,
} from "@/Module/Encounters/api/encounterGeneratorApi";
import {
	computeEncounterDifficulty,
	xpForCr,
	type IDifficultyResult,
} from "@/Module/Encounters/util/difficulty";
import {
	ENCOUNTER_SETTINGS,
	type CombatStyle,
	type EncounterDisposition,
	type IEncounterSetting,
	type IEncounterTheme,
	type IThemeMonster,
} from "@/Module/Encounters/util/generatorThemes";

export type TargetDifficulty = "Easy" | "Medium" | "Hard" | "Deadly";
export type EncounterRole = "leader" | "elite" | "minion";

export const TARGET_DIFFICULTIES: TargetDifficulty[] = ["Easy", "Medium", "Hard", "Deadly"];

export interface IGeneratorOptions {
	settingId?: string;
	disposition?: EncounterDisposition;
	themeId?: string;
	difficulty: TargetDifficulty;
	partyLevels: number[];
}

export interface IGeneratedMonster {
	monster: IGeneratorMonster;
	quantity: number;
	role: EncounterRole;
	style: CombatStyle;
}

export interface IGeneratedEncounter {
	setting: IEncounterSetting;
	theme: IEncounterTheme;
	composition: string;
	hook: string;
	tactics: string[];
	monsters: IGeneratedMonster[];
	difficulty: IDifficultyResult;
}

// ── Composition templates ───────────────────────────────────────────────

type Range = [number, number];

interface IComposition {
	name: string;
	weight: number;
	leader: 0 | 1;
	elites: Range;
	minions: Range;
	// Share of the raw XP budget each tier should eat (normalised later).
	share: { leader: number; elite: number; minion: number };
}

const COMPOSITIONS: IComposition[] = [
	{
		name: "Warband — a leader, two lieutenants and their troops",
		weight: 4,
		leader: 1,
		elites: [2, 2],
		minions: [2, 4],
		share: { leader: 0.4, elite: 0.35, minion: 0.25 },
	},
	{
		name: "Horde — a boss and a mob of weaklings",
		weight: 3,
		leader: 1,
		elites: [0, 0],
		minions: [5, 7],
		share: { leader: 0.5, elite: 0, minion: 0.5 },
	},
	{
		name: "Squad — a sergeant and a handful of soldiers",
		weight: 3,
		leader: 0,
		elites: [1, 1],
		minions: [3, 5],
		share: { leader: 0, elite: 0.45, minion: 0.55 },
	},
	{
		name: "Skirmish — a tough one with a couple of helpers",
		weight: 2,
		leader: 0,
		elites: [1, 1],
		minions: [1, 2],
		share: { leader: 0, elite: 0.6, minion: 0.4 },
	},
	{
		name: "Strike team — elites without the rabble",
		weight: 2,
		leader: 0,
		elites: [2, 3],
		minions: [0, 0],
		share: { leader: 0, elite: 1, minion: 0 },
	},
	{
		name: "Boss & bodyguards",
		weight: 2,
		leader: 1,
		elites: [1, 2],
		minions: [0, 0],
		share: { leader: 0.6, elite: 0.4, minion: 0 },
	},
	{
		name: "Solo — one strong creature",
		weight: 1,
		leader: 1,
		elites: [0, 0],
		minions: [0, 0],
		share: { leader: 1, elite: 0, minion: 0 },
	},
	{
		name: "Swarm — lots of weak creatures",
		weight: 1,
		leader: 0,
		elites: [0, 0],
		minions: [5, 8],
		share: { leader: 0, elite: 0, minion: 1 },
	},
];

const ATTEMPTS = 400;

// ── Helpers ─────────────────────────────────────────────────────────────

const rand = (min: number, max: number) => min + Math.floor(Math.random() * (max - min + 1));
const pick = <T>(list: T[]): T => list[Math.floor(Math.random() * list.length)]!;
const shuffle = <T>(list: T[]) => [...list].sort(() => Math.random() - 0.5);

function weightedPick<T>(items: T[], weight: (t: T) => number): T {
	const total = items.reduce((s, i) => s + weight(i), 0);
	let roll = Math.random() * total;
	for (const item of items) {
		roll -= weight(item);
		if (roll <= 0) return item;
	}
	return items[items.length - 1]!;
}

interface IPoolMonster {
	monster: IGeneratorMonster;
	style: CombatStyle;
	xp: number;
}

// Names → monsters, cached for the session (themes reuse a lot of names).
const monsterCache = new Map<string, Promise<IGeneratorMonster | null>>();

function resolveMonster(name: string) {
	let cached = monsterCache.get(name);
	if (!cached) {
		cached = encounterGeneratorApi.findByName(name);
		monsterCache.set(name, cached);
		// Don't cache failures, so a network blip doesn't stick.
		cached.then((m) => !m && monsterCache.delete(name));
	}
	return cached;
}

async function resolvePool(list: IThemeMonster[]): Promise<IPoolMonster[]> {
	const resolved = await Promise.all(list.map((t) => resolveMonster(t.name)));
	return resolved.flatMap((monster, i) =>
		monster && xpForCr(monster.crValue) > 0
			? [{ monster, style: list[i]!.style, xp: xpForCr(monster.crValue) }]
			: [],
	);
}

export function themesFor(settingId?: string, disposition?: EncounterDisposition): IEncounterTheme[] {
	const settings = settingId ? ENCOUNTER_SETTINGS.filter((s) => s.id === settingId) : ENCOUNTER_SETTINGS;
	return settings.flatMap((s) => s.themes).filter((t) => !disposition || t.disposition === disposition);
}

function chooseSettingAndTheme(options: IGeneratorOptions) {
	const setting = ENCOUNTER_SETTINGS.find((s) => s.id === options.settingId) ?? pick(ENCOUNTER_SETTINGS);

	const explicit = setting.themes.find((t) => t.id === options.themeId);
	if (explicit) return { setting, theme: explicit };

	const matching = setting.themes.filter((t) => !options.disposition || t.disposition === options.disposition);
	return { setting, theme: pick(matching.length ? matching : setting.themes) };
}

function xpBand(thresholds: NonNullable<IDifficultyResult["thresholds"]>, target: TargetDifficulty): Range {
	switch (target) {
		case "Easy":
			return [thresholds.easy, thresholds.medium - 1];
		case "Medium":
			return [thresholds.medium, thresholds.hard - 1];
		case "Hard":
			return [thresholds.hard, thresholds.deadly - 1];
		case "Deadly":
			return [thresholds.deadly, Math.round(thresholds.deadly * 1.5)];
	}
}

// ── Candidate building ──────────────────────────────────────────────────

// Pick `kinds` distinct monsters whose XP is near `unitXp`, strictly below
// `xpCap` (to keep the pecking order), preferring styles not yet used.
function pickKinds(
	pool: IPoolMonster[],
	kinds: number,
	unitXp: number,
	xpCap: number,
	usedStyles: Set<CombatStyle>,
	usedIds: Set<string>,
): IPoolMonster[] {
	const eligible = pool.filter((p) => p.xp < xpCap && !usedIds.has(p.monster.id));
	if (!eligible.length) return [];

	// Closeness to the target unit XP on a log scale (×2 off = distance 1).
	const fit = (p: IPoolMonster) => Math.abs(Math.log2(p.xp / Math.max(unitXp, 1)));
	const bestFit = Math.min(...eligible.map(fit));
	// Allow a little slack beyond the best fit so picks stay varied.
	let candidates = shuffle(eligible.filter((p) => fit(p) <= bestFit + 1.2));

	const chosen: IPoolMonster[] = [];
	while (chosen.length < kinds && candidates.length) {
		const fresh = candidates.filter((p) => !usedStyles.has(p.style));
		const next = pick(fresh.length ? fresh : candidates);
		chosen.push(next);
		usedStyles.add(next.style);
		usedIds.add(next.monster.id);
		candidates = candidates.filter((p) => p !== next);
	}
	return chosen;
}

// Spread `count` creatures over the chosen kinds, at least one each.
function distribute(count: number, kinds: IPoolMonster[]): number[] {
	const qty = kinds.map(() => 1);
	for (let i = kinds.length; i < count; i++) qty[rand(0, kinds.length - 1)]!++;
	return qty;
}

interface IPools {
	leaders: IPoolMonster[];
	elites: IPoolMonster[];
	minions: IPoolMonster[];
}

function buildCandidate(
	comp: IComposition,
	pools: IPools,
	partyLevels: number[],
	band: Range,
): IGeneratedMonster[] | null {
	const leaderCount = comp.leader;
	const eliteCount = rand(...comp.elites);
	const minionCount = rand(...comp.minions);
	const total = leaderCount + eliteCount + minionCount;

	// Higher tiers can borrow from the tier above so the generator scales to
	// high-level parties (e.g. a Bandit Captain fights as an elite).
	const leaderPool = pools.leaders;
	const elitePool = [...pools.elites, ...pools.leaders];
	const minionPool = [...pools.minions, ...pools.elites];

	if (leaderCount && !leaderPool.length) return null;
	if (eliteCount && !elitePool.length) return null;
	if (minionCount && !minionPool.length) return null;

	// Raw XP we're aiming for, before the group-size multiplier.
	const multiplier = computeEncounterDifficulty([{ crValue: 1, quantity: total }], partyLevels).multiplier;
	const targetAdjusted = band[0] + Math.random() * (band[1] - band[0]);
	const rawBudget = targetAdjusted / multiplier;

	// Jitter the shares a bit so the same template doesn't always split the same way.
	const jitter = () => 0.8 + Math.random() * 0.4;
	const share = {
		leader: leaderCount ? comp.share.leader * jitter() : 0,
		elite: eliteCount ? comp.share.elite * jitter() : 0,
		minion: minionCount ? comp.share.minion * jitter() : 0,
	};
	const shareTotal = share.leader + share.elite + share.minion;

	const usedStyles = new Set<CombatStyle>();
	const usedIds = new Set<string>();
	const result: IGeneratedMonster[] = [];

	let cap = Infinity;

	if (leaderCount) {
		const [leader] = pickKinds(leaderPool, 1, (rawBudget * share.leader) / shareTotal, cap, usedStyles, usedIds);
		if (!leader) return null;
		result.push({ monster: leader.monster, quantity: 1, role: "leader", style: leader.style });
		cap = leader.xp;
	}

	if (eliteCount) {
		const unit = (rawBudget * share.elite) / shareTotal / eliteCount;
		const kinds = pickKinds(elitePool, Math.min(eliteCount, 2), unit, cap, usedStyles, usedIds);
		if (!kinds.length) return null;
		distribute(eliteCount, kinds).forEach((quantity, i) =>
			result.push({ monster: kinds[i]!.monster, quantity, role: "elite", style: kinds[i]!.style }),
		);
		cap = Math.min(...kinds.map((k) => k.xp));
	}

	if (minionCount) {
		const unit = (rawBudget * share.minion) / shareTotal / minionCount;
		const kindCount = minionCount >= 5 ? rand(1, 3) : rand(1, 2);
		const kinds = pickKinds(minionPool, Math.min(kindCount, minionCount), unit, cap, usedStyles, usedIds);
		if (!kinds.length) return null;
		distribute(minionCount, kinds).forEach((quantity, i) =>
			result.push({ monster: kinds[i]!.monster, quantity, role: "minion", style: kinds[i]!.style }),
		);
	}

	tuneQuantities(result, partyLevels, band, comp.minions[1] + 2);
	return result;
}

// Nudge the rank-and-file count up or down until adjusted XP sits in the
// band — e.g. a level-1 party needs 2 guards, not the template's 5. Only
// the lowest tier present is touched, and nothing drops below one.
function tuneQuantities(monsters: IGeneratedMonster[], partyLevels: number[], [lo, hi]: Range, maxTroops: number) {
	const tier = (["minion", "elite"] as const).find((role) => monsters.some((m) => m.role === role));
	if (!tier) return;
	const troops = monsters.filter((m) => m.role === tier);
	const troopCount = () => troops.reduce((s, m) => s + m.quantity, 0);
	const xp = () => evaluate(monsters, partyLevels).adjustedXp;

	for (let i = 0; i < 12 && xp() > hi; i++) {
		const shrinkable = troops.filter((m) => m.quantity > 1);
		if (!shrinkable.length) break;
		pick(shrinkable).quantity--;
	}

	for (let i = 0; i < 12 && xp() < lo && troopCount() < maxTroops; i++) {
		const t = pick(troops);
		t.quantity++;
		if (xp() > hi) {
			t.quantity--;
			break;
		}
	}
}

// ── Scoring: what makes a fight interesting ─────────────────────────────

function evaluate(monsters: IGeneratedMonster[], partyLevels: number[]) {
	return computeEncounterDifficulty(
		monsters.map((m) => ({ crValue: m.monster.crValue, quantity: m.quantity })),
		partyLevels,
	);
}

function funScore(monsters: IGeneratedMonster[], difficulty: IDifficultyResult, band: Range, partySize: number) {
	let score = 0;

	// Mixed tactics: melee to hold the line, ranged/casters to punish
	// players who hang back. Each extra style is worth a lot.
	const styles = new Set(monsters.map((m) => m.style));
	score += (styles.size - 1) * 3;
	if (!styles.has("melee")) score -= 2; // nobody to tie up the frontline

	// 2–4 different creatures is the sweet spot; 1 is samey, 5+ is a mess to run.
	const kinds = monsters.length;
	score += kinds >= 2 && kinds <= 4 ? 2 : kinds === 1 ? -1 : 0;

	// A clear boss: leader worth at least double the next strongest.
	const leader = monsters.find((m) => m.role === "leader");
	const others = monsters.filter((m) => m !== leader);
	if (leader && others.length) {
		const nextBest = Math.max(...others.map((m) => xpForCr(m.monster.crValue)));
		if (xpForCr(leader.monster.crValue) >= nextBest * 2) score += 2;
	}

	// Action economy: roughly 1–2 enemies per player keeps everyone busy
	// without turning into a slog. A lone monster vs 4+ players is usually
	// over in two rounds.
	const count = monsters.reduce((s, m) => s + m.quantity, 0);
	const ratio = count / partySize;
	if (ratio >= 0.75 && ratio <= 2) score += 2;
	else if (ratio > 3) score -= 2;
	if (count === 1 && partySize >= 4) score -= 2;

	// A spellcaster or two is spicy; a squad of them is a slog for the DM.
	const casters = monsters.filter((m) => m.style === "caster").reduce((s, m) => s + m.quantity, 0);
	if (casters > Math.max(2, partySize / 2)) score -= 3;

	// Prefer the middle of the difficulty band over scraping its edges.
	const mid = (band[0] + band[1]) / 2;
	const halfWidth = Math.max((band[1] - band[0]) / 2, 1);
	score += 1 - Math.min(Math.abs(difficulty.adjustedXp - mid) / halfWidth, 1);

	return score;
}

function tacticsFor(monsters: IGeneratedMonster[]): string[] {
	const tips: string[] = [];
	const byStyle = (s: CombatStyle) => monsters.filter((m) => m.style === s).map((m) => m.monster.name);
	const leader = monsters.find((m) => m.role === "leader");
	const minions = monsters.filter((m) => m.role === "minion");

	const melee = byStyle("melee");
	const ranged = byStyle("ranged");
	const casters = byStyle("caster");

	if (melee.length && (ranged.length || casters.length)) {
		tips.push(`${melee.join(", ")} rush the frontline while ${[...ranged, ...casters].join(", ")} hang back.`);
	}
	if (ranged.length) tips.push(`${ranged.join(", ")} take cover and focus whoever is exposed or spellcasting.`);
	if (casters.length) tips.push(`${casters.join(", ")} open with their best area spell or control effect.`);
	if (leader && minions.length) {
		tips.push(`The ${leader.monster.name} lets the minions soak the first hits, and the rest may flee or surrender if it falls.`);
	} else if (leader) {
		tips.push(`The ${leader.monster.name} uses terrain and mobility. Don't let it stand still and trade blows.`);
	}
	if (!leader && minions.length >= 5) tips.push("They try to surround one target. Morale breaks at half numbers.");

	return tips;
}

// Template name if the final roster still matches it (tuning may have
// trimmed or padded troops), otherwise a plain count summary.
function describeComposition(comp: IComposition, monsters: IGeneratedMonster[]) {
	const count = (role: EncounterRole) =>
		monsters.filter((m) => m.role === role).reduce((s, m) => s + m.quantity, 0);
	const [leaders, elites, minions] = [count("leader"), count("elite"), count("minion")];
	const within = (n: number, [min, max]: Range) => n >= min && n <= max;

	if (leaders === comp.leader && within(elites, comp.elites) && within(minions, comp.minions)) return comp.name;

	const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;
	return [
		leaders && plural(leaders, "leader"),
		elites && plural(elites, "elite"),
		minions && plural(minions, "minion"),
	]
		.filter(Boolean)
		.join(" + ");
}

// ── Entry point ─────────────────────────────────────────────────────────

export async function generateEncounter(options: IGeneratorOptions): Promise<IGeneratedEncounter> {
	if (!options.partyLevels.length) throw new Error("Add at least one player.");

	const { setting, theme } = chooseSettingAndTheme(options);
	const [leaders, elites, minions] = await Promise.all([
		resolvePool(theme.leaders),
		resolvePool(theme.elites),
		resolvePool(theme.minions),
	]);
	const pools: IPools = { leaders, elites, minions };
	if (!leaders.length && !elites.length && !minions.length) {
		throw new Error(`Couldn't find any monsters for "${theme.name}" in the bestiary.`);
	}

	const partySize = options.partyLevels.length;
	const thresholds = computeEncounterDifficulty([], options.partyLevels).thresholds!;
	const band = xpBand(thresholds, options.difficulty);

	type Candidate = { comp: IComposition; monsters: IGeneratedMonster[]; difficulty: IDifficultyResult };
	const hits: (Candidate & { score: number })[] = [];
	let closest: (Candidate & { distance: number }) | null = null;

	for (let i = 0; i < ATTEMPTS && hits.length < 40; i++) {
		const comp = weightedPick(COMPOSITIONS, (c) => c.weight);
		const monsters = buildCandidate(comp, pools, options.partyLevels, band);
		if (!monsters) continue;

		const difficulty = evaluate(monsters, options.partyLevels);
		if (difficulty.label === options.difficulty) {
			hits.push({ comp, monsters, difficulty, score: funScore(monsters, difficulty, band, partySize) });
			continue;
		}

		const xp = difficulty.adjustedXp;
		const distance = xp < band[0] ? band[0] - xp : xp - band[1];
		if (!closest || distance < closest.distance) closest = { comp, monsters, difficulty, distance };
	}

	// Pick among the top-scoring fights, weighted by score, so the result
	// is good but not the same every time.
	let chosen: Candidate | null = closest;
	if (hits.length) {
		// The same roster can be rolled many times; dedupe so the top picks differ.
		const signature = (c: Candidate) =>
			c.monsters
				.map((m) => `${m.monster.id}:${m.quantity}`)
				.sort()
				.join("|");
		const unique = [...new Map(hits.map((h) => [signature(h), h])).values()];
		unique.sort((a, b) => b.score - a.score);
		const top = unique.slice(0, 5);
		const floor = Math.min(...top.map((h) => h.score));
		chosen = weightedPick(top, (h) => h.score - floor + 1);
	}
	if (!chosen) throw new Error("Couldn't build an encounter for that party. Try another setting.");

	const roleOrder: Record<EncounterRole, number> = { leader: 0, elite: 1, minion: 2 };
	const monsters = [...chosen.monsters].sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);

	return {
		setting,
		theme,
		composition: describeComposition(chosen.comp, monsters),
		hook: pick(theme.hooks),
		tactics: tacticsFor(monsters),
		monsters,
		difficulty: chosen.difficulty,
	};
}
