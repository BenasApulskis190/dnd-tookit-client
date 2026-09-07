// D&D 5e (DMG) encounter-difficulty math: compare the party's XP thresholds
// against the monsters' adjusted XP (raw XP times a multiplier that grows
// with monster count, since more monsters are disproportionately dangerous).

export type DifficultyLabel = "Trivial" | "Easy" | "Medium" | "Hard" | "Deadly";

// CR -> XP, straight from the DMG table. Keyed by the numeric `crValue`
// column on Monster (e.g. 0.125 for CR 1/8).
const XP_BY_CR: Record<string, number> = {
	"0": 10,
	"0.125": 25,
	"0.25": 50,
	"0.5": 100,
	"1": 200,
	"2": 450,
	"3": 700,
	"4": 1100,
	"5": 1800,
	"6": 2300,
	"7": 2900,
	"8": 3900,
	"9": 5000,
	"10": 5900,
	"11": 7200,
	"12": 8400,
	"13": 10000,
	"14": 11500,
	"15": 13000,
	"16": 15000,
	"17": 18000,
	"18": 20000,
	"19": 22000,
	"20": 25000,
	"21": 33000,
	"22": 41000,
	"23": 50000,
	"24": 62000,
	"25": 75000,
	"26": 90000,
	"27": 105000,
	"28": 120000,
	"29": 135000,
	"30": 155000,
};

// Per-character XP thresholds by level, [easy, medium, hard, deadly].
const THRESHOLDS_BY_LEVEL: Record<number, [number, number, number, number]> = {
	1: [25, 50, 75, 100],
	2: [50, 100, 150, 200],
	3: [75, 150, 225, 400],
	4: [125, 250, 375, 500],
	5: [250, 500, 750, 1100],
	6: [300, 600, 900, 1400],
	7: [350, 750, 1100, 1700],
	8: [450, 900, 1400, 2100],
	9: [550, 1100, 1600, 2400],
	10: [600, 1200, 1900, 2800],
	11: [800, 1600, 2400, 3600],
	12: [1000, 2000, 3000, 4500],
	13: [1100, 2200, 3400, 5100],
	14: [1250, 2500, 3800, 5700],
	15: [1400, 2800, 4300, 6400],
	16: [1600, 3200, 4800, 7200],
	17: [2000, 3900, 5900, 8800],
	18: [2100, 4200, 6300, 9500],
	19: [2400, 4900, 7300, 10900],
	20: [2800, 5700, 8500, 12700],
};

// Multiplier buckets by total monster count, ascending.
const MULTIPLIER_BUCKETS: { max: number; multiplier: number }[] = [
	{ max: 1, multiplier: 1 },
	{ max: 2, multiplier: 1.5 },
	{ max: 6, multiplier: 2 },
	{ max: 10, multiplier: 2.5 },
	{ max: 14, multiplier: 3 },
	{ max: Infinity, multiplier: 4 },
];

export function xpForCr(crValue: number | null | undefined): number {
	if (crValue == null) return 0;
	return XP_BY_CR[String(crValue)] ?? 0;
}

function monsterMultiplier(totalMonsters: number, partySize: number): number {
	if (totalMonsters <= 0) return 1;

	let bucketIndex = MULTIPLIER_BUCKETS.findIndex((b) => totalMonsters <= b.max);
	if (bucketIndex === -1) bucketIndex = MULTIPLIER_BUCKETS.length - 1;

	// DMG rule: a small party (<=2) treats the encounter as one bracket
	// harder; a large party (>=6) treats it as one bracket easier.
	if (partySize > 0 && partySize <= 2) bucketIndex = Math.min(bucketIndex + 1, MULTIPLIER_BUCKETS.length - 1);
	else if (partySize >= 6) bucketIndex = Math.max(bucketIndex - 1, 0);

	return MULTIPLIER_BUCKETS[bucketIndex]!.multiplier;
}

export interface IEncounterMonsterXp {
	crValue: number | null | undefined;
	quantity: number;
}

export interface IDifficultyResult {
	label: DifficultyLabel | null;
	adjustedXp: number;
	rawXp: number;
	multiplier: number;
	thresholds: { easy: number; medium: number; hard: number; deadly: number } | null;
}

export function computeEncounterDifficulty(
	monsters: IEncounterMonsterXp[],
	partyLevels: number[],
): IDifficultyResult {
	const totalMonsters = monsters.reduce((sum, m) => sum + m.quantity, 0);
	const rawXp = monsters.reduce((sum, m) => sum + xpForCr(m.crValue) * m.quantity, 0);
	const multiplier = monsterMultiplier(totalMonsters, partyLevels.length);
	const adjustedXp = Math.round(rawXp * multiplier);

	if (partyLevels.length === 0) {
		return { label: null, adjustedXp, rawXp, multiplier, thresholds: null };
	}

	const thresholds = partyLevels.reduce(
		(acc, level) => {
			const row = THRESHOLDS_BY_LEVEL[Math.min(Math.max(level, 1), 20)]!;
			acc.easy += row[0];
			acc.medium += row[1];
			acc.hard += row[2];
			acc.deadly += row[3];
			return acc;
		},
		{ easy: 0, medium: 0, hard: 0, deadly: 0 },
	);

	let label: DifficultyLabel = "Trivial";
	if (adjustedXp >= thresholds.deadly) label = "Deadly";
	else if (adjustedXp >= thresholds.hard) label = "Hard";
	else if (adjustedXp >= thresholds.medium) label = "Medium";
	else if (adjustedXp >= thresholds.easy) label = "Easy";

	return { label, adjustedXp, rawXp, multiplier, thresholds };
}
