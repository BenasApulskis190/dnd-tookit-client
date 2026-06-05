<script lang="ts" setup>
import type {
	MonsterTrait,
	Entry,
	EntryList,
	EntryTable,
	EntryInline,
} from "@/Module/EncounterManager/types";

defineProps<{ trait: MonsterTrait }>();

const SPELL_LEVEL_LABELS: Record<string, string> = {
	"0": "Cantrips (at will)",
	"1": "1st level",
	"2": "2nd level",
	"3": "3rd level",
	"4": "4th level",
	"5": "5th level",
	"6": "6th level",
	"7": "7th level",
	"8": "8th level",
	"9": "9th level",
};

function clean(text: string): string {
	// 5etools tag format: {@tag content}, {@tag content|source}, {@tag content|source|display}
	// Show: display (3rd part) if present, else content (1st). Source (2nd) is never shown.
	return text.replace(
		/\{@\w+\s([^|}]+)(?:\|([^|}]*)(?:\|([^}]*))?)?\}/g,
		(_, content, _source, display) => display ?? content,
	);
}

function spellLevelLabel(level: string, slots?: number): string {
	const base = SPELL_LEVEL_LABELS[level] ?? `${level}th level`;
	if (level === "0" || !slots) return base;
	return `${base} (${slots} slot${slots !== 1 ? "s" : ""})`;
}

function isEntryList(e: Entry): e is EntryList {
	return typeof e === "object" && e.type === "list";
}

function isEntryTable(e: Entry): e is EntryTable {
	return typeof e === "object" && e.type === "table";
}

function isEntryInline(e: Entry): e is EntryInline {
	return typeof e === "object" && e.type === "inline";
}
</script>

<template>
	<div>
		<template v-if="trait.spells">
			<p v-for="(line, i) in trait.headerEntries" :key="i" class="mb-1">
				{{ clean(line) }}
			</p>
			<ul class="mt-1 space-y-0.5 pl-4">
				<li v-for="(levelData, level) in trait.spells" :key="level">
					<span class="italic">{{ spellLevelLabel(String(level), levelData.slots) }}:</span>
					{{ levelData.spells.map(clean).join(", ") }}
				</li>
			</ul>
			<p
				v-for="(line, i) in trait.footerEntries"
				:key="'footer-' + i"
				class="mt-1 italic text-gray-500 text-xs"
			>
				{{ clean(line) }}
			</p>
		</template>

		<template v-else-if="trait.entries">
			<template v-for="(entry, i) in trait.entries" :key="i">
				<p v-if="typeof entry === 'string'">{{ clean(entry) }}</p>

				<ul v-else-if="isEntryList(entry)" class="mt-1 space-y-0.5 pl-4 list-disc">
					<li v-for="item in entry.items" :key="item.name">
						<span class="font-semibold italic">{{ item.name }}</span>
						{{ clean(item.entry) }}
					</li>
				</ul>

				<table
					v-else-if="isEntryTable(entry)"
					class="mt-1 w-full text-xs border-collapse"
				>
					<thead v-if="entry.colLabels?.length">
						<tr class="border-b border-red-200">
							<th
								v-for="col in entry.colLabels"
								:key="col"
								class="px-2 py-1 text-left font-bold text-red-800"
							>
								{{ col }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(row, ri) in entry.rows"
							:key="ri"
							class="border-b border-gray-100 odd:bg-gray-50"
						>
							<td
								v-for="(cell, ci) in row"
								:key="ci"
								class="px-2 py-1 align-top"
							>
								{{ typeof cell === "string" ? clean(cell) : cell }}
							</td>
						</tr>
					</tbody>
				</table>

				<p v-else-if="isEntryInline(entry)">
					{{ entry.entries?.map(clean).join(" ") }}
				</p>
			</template>
		</template>
	</div>
</template>
