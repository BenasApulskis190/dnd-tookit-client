// Curated encounter themes per setting. Monster names are resolved against
// the bestiary by exact name at generation time (preferring the MM version),
// so every name here must match a Monster row.

export type EncounterDisposition = "hostile" | "neutral" | "friendly";
export type CombatStyle = "melee" | "ranged" | "caster";

export interface IThemeMonster {
	name: string;
	style: CombatStyle;
}

export interface IEncounterTheme {
	id: string;
	name: string;
	disposition: EncounterDisposition;
	// Weak rank-and-file — the "2–4 goblins" part of an encounter.
	minions: IThemeMonster[];
	// Strong lieutenants that back up the leader.
	elites: IThemeMonster[];
	// The boss; at most one per encounter.
	leaders: IThemeMonster[];
	// Short scene hooks; one is picked as the encounter description.
	hooks: string[];
}

export interface IEncounterSetting {
	id: string;
	name: string;
	themes: IEncounterTheme[];
}

export const DISPOSITION_LABELS: Record<EncounterDisposition, string> = {
	hostile: "Hostile (evil)",
	neutral: "Neutral",
	friendly: "Friendly (good)",
};

export const STYLE_LABELS: Record<CombatStyle, { label: string; glyph: string }> = {
	melee: { label: "Melee", glyph: "⚔" },
	ranged: { label: "Ranged", glyph: "➶" },
	caster: { label: "Caster", glyph: "✦" },
};

const m = (name: string): IThemeMonster => ({ name, style: "melee" });
const r = (name: string): IThemeMonster => ({ name, style: "ranged" });
const c = (name: string): IThemeMonster => ({ name, style: "caster" });

export const ENCOUNTER_SETTINGS: IEncounterSetting[] = [
	{
		id: "city",
		name: "City",
		themes: [
			{
				id: "city-thugs",
				name: "Street Thugs",
				disposition: "hostile",
				minions: [m("Bandit"), m("Thug"), r("Scout"), c("Apprentice Wizard")],
				elites: [r("Spy"), m("Bandit Captain"), m("Swashbuckler"), r("Archer"), c("Illusionist")],
				leaders: [m("Bandit Captain"), m("Master Thief"), m("Assassin"), c("Mage"), m("Gladiator")],
				hooks: [
					"A gang corners the party in a narrow alley, demanding a 'street toll'.",
					"Thieves' guild enforcers mistake the party for rivals encroaching on their turf.",
				],
			},
			{
				id: "city-cult",
				name: "Hidden Cult",
				disposition: "hostile",
				minions: [m("Cultist"), c("Acolyte"), m("Thug"), r("Scout")],
				elites: [c("Cult Fanatic"), c("Priest"), m("Veteran"), r("Archer")],
				leaders: [c("Cult Fanatic"), c("Mage"), m("Blackguard"), c("Necromancer")],
				hooks: [
					"The party stumbles into a candle-lit ritual in a warehouse cellar.",
					"Robed figures follow the party through the market, then strike in a quiet square.",
				],
			},
			{
				id: "city-sewers",
				name: "Sewer Lurkers",
				disposition: "hostile",
				minions: [m("Giant Rat"), m("Swarm of Rats"), r("Kenku"), m("Stirge")],
				elites: [m("Wererat"), r("Kenku"), m("Gray Ooze"), c("Cult Fanatic")],
				leaders: [m("Wererat"), m("Otyugh"), c("Mage")],
				hooks: [
					"Something chitters in the dark tunnels beneath the city.",
					"A missing-persons trail leads down a storm drain into the sewers.",
				],
			},
			{
				id: "city-graveyard",
				name: "Restless Graveyard",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Ghoul"), m("Shadow")],
				elites: [m("Ghast"), m("Specter"), r("Wight"), c("Will-o'-Wisp")],
				leaders: [r("Wight"), m("Vampire Spawn"), m("Mummy"), c("Necromancer"), m("Wraith")],
				hooks: [
					"Fresh graves in the city cemetery have been dug up — from the inside.",
					"A gravedigger begs for help as the dead rise at midnight.",
				],
			},
			{
				id: "city-watch",
				name: "City Watch",
				disposition: "neutral",
				minions: [m("Guard"), r("Scout"), c("Acolyte")],
				elites: [m("Veteran"), r("Archer"), c("Priest"), m("Knight")],
				leaders: [m("Knight"), m("Gladiator"), m("Champion"), c("War Priest")],
				hooks: [
					"A patrol stops the party for questioning about a recent crime.",
					"The watch is enforcing a curfew and the party is out after dark.",
				],
			},
			{
				id: "city-townsfolk",
				name: "Townsfolk",
				disposition: "friendly",
				minions: [m("Commoner"), c("Acolyte"), m("Guard"), m("Noble")],
				elites: [c("Priest"), c("Bard"), m("Veteran"), r("Spy")],
				leaders: [c("Priest"), c("Mage"), m("Knight")],
				hooks: [
					"A festival crowd draws the party into games, gossip and rumours.",
					"Worried locals ask the party for help with a problem the watch ignores.",
				],
			},
		],
	},
	{
		id: "forest",
		name: "Forest",
		themes: [
			{
				id: "forest-goblins",
				name: "Goblin Ambush",
				disposition: "hostile",
				minions: [r("Goblin"), m("Wolf"), m("Hobgoblin"), m("Worg")],
				elites: [m("Bugbear"), m("Goblin Boss"), m("Hobgoblin Captain"), c("Hobgoblin Devastator")],
				leaders: [m("Goblin Boss"), m("Bugbear Chief"), c("Hobgoblin Devastator"), m("Hobgoblin Warlord")],
				hooks: [
					"Arrows fly from the treeline as a felled log blocks the trail.",
					"A snare snaps shut and goblins cackle from the undergrowth.",
				],
			},
			{
				id: "forest-blights",
				name: "Corrupted Woods",
				disposition: "hostile",
				minions: [m("Twig Blight"), r("Needle Blight"), m("Vine Blight"), m("Awakened Shrub")],
				elites: [m("Vine Blight"), m("Awakened Tree"), c("Will-o'-Wisp"), c("Druid")],
				leaders: [c("Green Hag"), m("Shambling Mound"), c("Annis Hag")],
				hooks: [
					"The trees here are grey and twisted, and the brush begins to move.",
					"A sickly sweet smell leads to a glade choked with creeping vines.",
				],
			},
			{
				id: "forest-bandits",
				name: "Highway Robbers",
				disposition: "hostile",
				minions: [m("Bandit"), r("Scout"), m("Thug"), c("Apprentice Wizard")],
				elites: [m("Bandit Captain"), r("Archer"), m("Veteran"), c("Druid")],
				leaders: [m("Bandit Captain"), m("Gladiator"), c("Mage"), m("Warlord")],
				hooks: [
					"A rope is pulled taut across the road and masked figures step out.",
					"An overturned wagon is bait for an ambush.",
				],
			},
			{
				id: "forest-beasts",
				name: "Wild Beasts",
				disposition: "neutral",
				minions: [m("Wolf"), m("Boar"), m("Giant Wolf Spider"), m("Panther"), m("Giant Badger")],
				elites: [m("Dire Wolf"), r("Giant Spider"), m("Brown Bear"), m("Giant Boar"), m("Giant Elk")],
				leaders: [m("Owlbear"), r("Phase Spider"), m("Giant Elk")],
				hooks: [
					"The party crosses into a hungry predator's territory.",
					"Startled animals burst from the brush, defending their young.",
				],
			},
			{
				id: "forest-fey",
				name: "Fey Glade",
				disposition: "friendly",
				minions: [r("Sprite"), c("Pixie"), m("Satyr"), m("Blink Dog")],
				elites: [c("Dryad"), r("Centaur"), c("Druid"), r("Scout")],
				leaders: [c("Unicorn"), m("Treant"), c("Archdruid")],
				hooks: [
					"Laughter echoes from a mushroom ring; the fey want to play a game.",
					"Forest guardians ask the party to prove they mean the woods no harm.",
				],
			},
		],
	},
	{
		id: "desert",
		name: "Desert",
		themes: [
			{
				id: "desert-raiders",
				name: "Nomad Raiders",
				disposition: "hostile",
				minions: [m("Tribal Warrior"), m("Bandit"), r("Scout"), m("Thug")],
				elites: [m("Berserker"), m("Bandit Captain"), r("Archer"), c("Cult Fanatic")],
				leaders: [m("Bandit Captain"), m("Gladiator"), m("Warlord"), c("Mage")],
				hooks: [
					"Riders appear over the dunes, kicking up a wall of sand.",
					"An oasis turns out to be the raiders' camp.",
				],
			},
			{
				id: "desert-gnolls",
				name: "Gnoll Pack",
				disposition: "hostile",
				minions: [r("Gnoll"), m("Hyena"), m("Giant Hyena"), r("Gnoll Hunter")],
				elites: [m("Gnoll Pack Lord"), m("Gnoll Flesh Gnawer"), m("Gnoll Fang of Yeenoghu")],
				leaders: [m("Gnoll Pack Lord"), m("Gnoll Fang of Yeenoghu"), m("Flind")],
				hooks: [
					"Hyena laughter carries over the dunes at dusk.",
					"The party finds a gnawed caravan — and the pack that did it.",
				],
			},
			{
				id: "desert-yuanti",
				name: "Serpent Cult",
				disposition: "hostile",
				minions: [m("Cultist"), m("Flying Snake"), m("Giant Poisonous Snake"), c("Yuan-ti Pureblood")],
				elites: [c("Yuan-ti Pureblood"), r("Yuan-ti Malison (Type 3)"), m("Yuan-ti Malison (Type 1)"), c("Cult Fanatic")],
				leaders: [m("Yuan-ti Malison (Type 2)"), c("Yuan-ti Abomination"), c("Yuan-ti Nightmare Speaker")],
				hooks: [
					"A half-buried serpent temple hisses with incense smoke.",
					"Hooded pilgrims at the oasis have unblinking, slitted eyes.",
				],
			},
			{
				id: "desert-tomb",
				name: "Tomb Guardians",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Ghoul"), m("Swarm of Insects")],
				elites: [m("Mummy"), m("Ghast"), r("Wight"), c("Lamia")],
				leaders: [c("Lamia"), c("Mummy Lord"), c("Necromancer")],
				hooks: [
					"A sandstorm uncovers the entrance to a forgotten tomb.",
					"Disturbing a sun-bleached obelisk wakes its ancient guardians.",
				],
			},
			{
				id: "desert-beasts",
				name: "Desert Predators",
				disposition: "neutral",
				minions: [m("Jackal"), m("Giant Poisonous Snake"), m("Giant Lizard"), m("Constrictor Snake")],
				elites: [m("Giant Scorpion"), m("Giant Vulture"), m("Giant Hyena"), m("Giant Constrictor Snake")],
				leaders: [m("Bulette"), m("Giant Scorpion"), m("Purple Worm")],
				hooks: [
					"The sand shifts beneath the party's feet.",
					"Vultures circle overhead — they aren't the only ones hungry.",
				],
			},
			{
				id: "desert-caravan",
				name: "Merchant Caravan",
				disposition: "friendly",
				minions: [m("Commoner"), m("Guard"), m("Camel"), r("Scout")],
				elites: [m("Veteran"), c("Priest"), r("Archer")],
				leaders: [m("Knight"), c("Mage")],
				hooks: [
					"A caravan offers water and trade in exchange for an escort.",
					"Lost merchants flag down the party, desperate for directions.",
				],
			},
		],
	},
	{
		id: "mountain",
		name: "Mountain",
		themes: [
			{
				id: "mountain-orcs",
				name: "Orc Warband",
				disposition: "hostile",
				minions: [m("Orc"), m("Worg"), r("Goblin")],
				elites: [m("Orog"), c("Orc Eye of Gruumsh"), m("Half-Ogre (Ogrillon)"), c("Orc Hand of Yurtrus"), m("Ogre")],
				leaders: [m("Orc War Chief"), c("Orc Claw of Luthic"), m("Orc Blade of Ilneval")],
				hooks: [
					"War drums echo through the pass.",
					"An orc raiding party is camped at the only bridge across the gorge.",
				],
			},
			{
				id: "mountain-giants",
				name: "Giant Raiders",
				disposition: "hostile",
				minions: [m("Ogre"), m("Giant Goat"), m("Worg")],
				elites: [m("Hill Giant"), m("Ogre"), m("Ettin"), r("Stone Giant")],
				leaders: [r("Stone Giant"), r("Frost Giant"), m("Fire Giant"), c("Cloud Giant")],
				hooks: [
					"Boulders crash down the slope towards the party.",
					"Giants are hunting goats — and the party looks tastier.",
				],
			},
			{
				id: "mountain-kobolds",
				name: "Kobold Clan",
				disposition: "hostile",
				minions: [m("Kobold"), r("Winged Kobold"), r("Kobold Inventor")],
				elites: [m("Kobold Dragonshield"), c("Kobold Scale Sorcerer"), m("Guard Drake")],
				leaders: [m("Red Dragon Wyrmling"), m("Young Red Dragon")],
				hooks: [
					"Tiny traps line a cave mouth decorated with dragon scales.",
					"Kobolds demand tribute 'for the Great Wyrm'.",
				],
			},
			{
				id: "mountain-beasts",
				name: "Peak Predators",
				disposition: "neutral",
				minions: [m("Giant Goat"), m("Blood Hawk"), c("Harpy"), m("Giant Eagle")],
				elites: [m("Griffon"), m("Hippogriff"), m("Peryton"), r("Manticore")],
				leaders: [m("Wyvern"), r("Manticore"), m("Chimera"), m("Roc")],
				hooks: [
					"A shadow passes over the party on a narrow ledge.",
					"The party climbs too close to a nest.",
				],
			},
			{
				id: "mountain-dwarves",
				name: "Dwarven Patrol",
				disposition: "friendly",
				minions: [m("Guard"), r("Scout"), c("Acolyte")],
				elites: [m("Veteran"), r("Archer"), c("Priest")],
				leaders: [m("Knight"), m("Champion"), c("War Priest")],
				hooks: [
					"Dwarven sentries hail the party from a hidden watchtower.",
					"A patrol returning from the deep roads shares news and ale.",
				],
			},
		],
	},
	{
		id: "swamp",
		name: "Swamp",
		themes: [
			{
				id: "swamp-lizardfolk",
				name: "Lizardfolk Hunters",
				disposition: "hostile",
				minions: [m("Lizardfolk"), m("Crocodile"), m("Giant Lizard"), r("Bullywug")],
				elites: [c("Lizardfolk Shaman"), m("Giant Crocodile"), m("Lizard King")],
				leaders: [m("Lizard King"), c("Lizardfolk Shaman"), c("Green Hag")],
				hooks: [
					"Reptilian eyes watch from the reeds.",
					"Lizardfolk hunters consider the party fair game.",
				],
			},
			{
				id: "swamp-bullywugs",
				name: "Bullywug Bog",
				disposition: "hostile",
				minions: [m("Bullywug"), m("Giant Frog"), m("Giant Poisonous Snake")],
				elites: [m("Giant Toad"), c("Will-o'-Wisp"), m("Crocodile")],
				leaders: [m("Giant Toad"), c("Green Hag")],
				hooks: [
					"Croaking grows louder as a bullywug 'king' demands obeisance.",
					"The party's boat is surrounded by frog-folk.",
				],
			},
			{
				id: "swamp-hag",
				name: "Hag's Domain",
				disposition: "hostile",
				minions: [m("Zombie"), m("Ghoul"), m("Swarm of Insects"), r("Skeleton")],
				elites: [c("Will-o'-Wisp"), m("Ghast"), m("Shambling Mound")],
				leaders: [c("Green Hag"), c("Night Hag"), c("Annis Hag")],
				hooks: [
					"A friendly old woman offers stew in a hut on stilts.",
					"Ghostly lights lure the party off the path.",
				],
			},
			{
				id: "swamp-beasts",
				name: "Swamp Beasts",
				disposition: "neutral",
				minions: [m("Crocodile"), m("Giant Frog"), m("Swarm of Insects"), m("Swarm of Poisonous Snakes")],
				elites: [m("Giant Toad"), m("Giant Crocodile"), m("Giant Constrictor Snake")],
				leaders: [m("Shambling Mound"), m("Hydra"), m("Giant Crocodile")],
				hooks: [
					"The 'log' the party steps on opens its eyes.",
					"A buzzing cloud rises from the stagnant water.",
				],
			},
			{
				id: "swamp-locals",
				name: "Marsh Folk",
				disposition: "friendly",
				minions: [m("Commoner"), m("Tribal Warrior"), r("Scout")],
				elites: [c("Druid"), m("Berserker")],
				leaders: [c("Druid"), c("Archdruid")],
				hooks: [
					"Stilt-village fisherfolk offer shelter from the rain.",
					"A swamp druid warns the party about what lives deeper in.",
				],
			},
		],
	},
	{
		id: "coastal",
		name: "Coastal",
		themes: [
			{
				id: "coastal-pirates",
				name: "Pirates",
				disposition: "hostile",
				minions: [m("Bandit"), m("Thug"), r("Scout"), c("Apprentice Wizard")],
				elites: [m("Bandit Captain"), m("Swashbuckler"), r("Archer"), c("Mage")],
				leaders: [m("Bandit Captain"), m("Swashbuckler"), c("Kraken Priest"), m("Warlord")],
				hooks: [
					"A longboat beaches at night carrying armed pirates.",
					"Smugglers in a sea cave don't want witnesses.",
				],
			},
			{
				id: "coastal-sahuagin",
				name: "Sahuagin Raid",
				disposition: "hostile",
				minions: [m("Sahuagin"), m("Reef Shark"), r("Merrow")],
				elites: [c("Sahuagin Priestess"), m("Merrow"), m("Hunter Shark"), c("Sea Hag")],
				leaders: [m("Sahuagin Baron"), c("Sahuagin Priestess"), m("Giant Shark")],
				hooks: [
					"Shark-folk surge out of the surf at high tide.",
					"A fishing village is under attack from the sea.",
				],
			},
			{
				id: "coastal-beasts",
				name: "Sea Creatures",
				disposition: "neutral",
				minions: [m("Giant Crab"), m("Reef Shark"), m("Swarm of Quippers"), m("Giant Sea Horse")],
				elites: [m("Hunter Shark"), m("Giant Octopus"), m("Plesiosaurus")],
				leaders: [m("Giant Shark"), m("Plesiosaurus"), m("Dragon Turtle")],
				hooks: [
					"Tide pools hide more than starfish.",
					"Something big is circling the pier.",
				],
			},
			{
				id: "coastal-merfolk",
				name: "Merfolk Envoys",
				disposition: "friendly",
				minions: [m("Merfolk"), m("Giant Sea Horse"), r("Scout")],
				elites: [c("Druid"), m("Veteran")],
				leaders: [c("Druid"), c("Storm Giant")],
				hooks: [
					"Merfolk surface to ask the party for help against a sea threat.",
					"A merfolk trader offers pearls for news from the land.",
				],
			},
		],
	},
	{
		id: "arctic",
		name: "Arctic",
		themes: [
			{
				id: "arctic-yeti",
				name: "Yeti Hunt",
				disposition: "hostile",
				minions: [c("Ice Mephit"), m("Wolf"), m("Yeti")],
				elites: [m("Yeti"), m("Winter Wolf")],
				leaders: [m("Abominable Yeti"), m("Young White Dragon")],
				hooks: [
					"Huge footprints circle the party's camp in the fresh snow.",
					"A howl cuts through the blizzard.",
				],
			},
			{
				id: "arctic-giants",
				name: "Frost Giant Hunters",
				disposition: "hostile",
				minions: [m("Wolf"), c("Ice Mephit"), m("Ogre")],
				elites: [m("Winter Wolf"), m("Ogre"), r("Frost Giant")],
				leaders: [r("Frost Giant"), m("Remorhaz"), m("Young White Dragon")],
				hooks: [
					"Giants and their wolves are tracking a mammoth — and find the party.",
					"An icy fortress looms; its sentries spot the intruders.",
				],
			},
			{
				id: "arctic-beasts",
				name: "Tundra Beasts",
				disposition: "neutral",
				minions: [m("Wolf"), m("Elk"), m("Polar Bear")],
				elites: [m("Polar Bear"), m("Saber-Toothed Tiger"), m("Mammoth")],
				leaders: [m("Mammoth"), m("Remorhaz")],
				hooks: [
					"Starving predators follow the party across the ice.",
					"A herd stampedes across the frozen plain.",
				],
			},
			{
				id: "arctic-tribe",
				name: "Ice Tribe",
				disposition: "friendly",
				minions: [m("Tribal Warrior"), r("Scout")],
				elites: [m("Berserker"), c("Druid")],
				leaders: [c("Druid"), m("Champion"), c("Archdruid")],
				hooks: [
					"Hunters invite the party to share their fire.",
					"A tribe asks for help retrieving a stolen totem.",
				],
			},
		],
	},
	{
		id: "grassland",
		name: "Grassland",
		themes: [
			{
				id: "grassland-hobgoblins",
				name: "Hobgoblin Legion",
				disposition: "hostile",
				minions: [m("Hobgoblin"), r("Goblin"), m("Worg")],
				elites: [m("Hobgoblin Captain"), c("Hobgoblin Devastator"), m("Hobgoblin Iron Shadow")],
				leaders: [m("Hobgoblin Captain"), c("Hobgoblin Devastator"), m("Hobgoblin Warlord")],
				hooks: [
					"A disciplined column marches across the plains under a war banner.",
					"Scouts from a hobgoblin legion are scouting the next village.",
				],
			},
			{
				id: "grassland-gnolls",
				name: "Gnoll Raiders",
				disposition: "hostile",
				minions: [r("Gnoll"), m("Hyena"), r("Gnoll Hunter")],
				elites: [m("Gnoll Pack Lord"), m("Gnoll Flesh Gnawer"), m("Gnoll Fang of Yeenoghu")],
				leaders: [m("Gnoll Pack Lord"), m("Gnoll Fang of Yeenoghu"), m("Flind")],
				hooks: [
					"Smoke rises from a farmstead on the horizon.",
					"Gnolls flush the party out of the tall grass.",
				],
			},
			{
				id: "grassland-beasts",
				name: "Plains Beasts",
				disposition: "neutral",
				minions: [m("Elk"), m("Hyena"), m("Boar"), m("Lion")],
				elites: [m("Lion"), m("Giant Boar"), r("Ankheg")],
				leaders: [r("Ankheg"), m("Bulette")],
				hooks: [
					"The ground erupts beneath the road.",
					"A pride of lions stalks the party through the grass.",
				],
			},
			{
				id: "grassland-centaurs",
				name: "Centaur Herd",
				disposition: "friendly",
				minions: [r("Scout"), m("Tribal Warrior"), m("Elk")],
				elites: [r("Centaur"), c("Druid")],
				leaders: [r("Centaur"), c("Druid"), c("Archdruid")],
				hooks: [
					"Centaurs gallop up to ask why the party crosses their land.",
					"A centaur herd offers to guide the party for a price.",
				],
			},
			{
				id: "grassland-farmers",
				name: "Farmers & Pilgrims",
				disposition: "friendly",
				minions: [m("Commoner"), c("Acolyte"), m("Guard")],
				elites: [c("Priest"), m("Veteran"), c("Bard")],
				leaders: [c("Priest"), m("Knight")],
				hooks: [
					"Pilgrims on the road share bread and a strange rumour.",
					"Farmers ask the party to look into missing livestock.",
				],
			},
		],
	},
	{
		id: "underdark",
		name: "Underdark",
		themes: [
			{
				id: "underdark-drow",
				name: "Drow Patrol",
				disposition: "hostile",
				minions: [r("Drow"), m("Quaggoth"), r("Giant Spider")],
				elites: [m("Drow Elite Warrior"), c("Drow Mage"), r("Drider")],
				leaders: [c("Drow Mage"), r("Drider"), c("Drow Priestess of Lolth")],
				hooks: [
					"Poisoned hand-crossbow bolts whisper out of the dark.",
					"Spiderwebs span the tunnel — and something is watching.",
				],
			},
			{
				id: "underdark-aberrations",
				name: "Mind Flayer Thralls",
				disposition: "hostile",
				minions: [m("Grimlock"), c("Intellect Devourer"), m("Quaggoth")],
				elites: [c("Nothic"), m("Chuul"), m("Quaggoth Thonot")],
				leaders: [c("Mind Flayer"), c("Aboleth"), c("Beholder")],
				hooks: [
					"A psychic hum gives everyone a splitting headache.",
					"Blank-eyed thralls shamble towards the party in eerie silence.",
				],
			},
			{
				id: "underdark-monsters",
				name: "Cavern Horrors",
				disposition: "neutral",
				minions: [m("Piercer"), m("Darkmantle"), m("Stirge"), m("Violet Fungus")],
				elites: [m("Hook Horror"), m("Carrion Crawler"), m("Gibbering Mouther")],
				leaders: [m("Umber Hulk"), r("Roper"), m("Gelatinous Cube"), m("Purple Worm")],
				hooks: [
					"Clacking echoes through the cavern.",
					"A stalactite drops, then another.",
				],
			},
			{
				id: "underdark-myconids",
				name: "Myconid Circle",
				disposition: "friendly",
				minions: [c("Myconid Sprout"), m("Myconid Adult")],
				elites: [m("Myconid Adult"), m("Deep Gnome (Svirfneblin)")],
				leaders: [c("Myconid Sovereign")],
				hooks: [
					"Spores drift over the party, sharing strange, peaceful visions.",
					"Fungus folk ask the party to drive off a threat to their grove.",
				],
			},
		],
	},
	{
		id: "dungeon",
		name: "Dungeon / Ruins",
		themes: [
			{
				id: "dungeon-undead",
				name: "Crypt Guardians",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Ghoul"), m("Shadow")],
				elites: [m("Ghast"), r("Wight"), m("Specter"), m("Mummy")],
				leaders: [m("Wraith"), c("Mummy Lord"), c("Necromancer"), m("Death Knight")],
				hooks: [
					"Sarcophagus lids grind open as the party enters.",
					"An ancient crypt's guardians stir at the sound of footsteps.",
				],
			},
			{
				id: "dungeon-kobolds",
				name: "Trapmaster Kobolds",
				disposition: "hostile",
				minions: [m("Kobold"), r("Winged Kobold"), r("Kobold Inventor")],
				elites: [m("Kobold Dragonshield"), c("Kobold Scale Sorcerer")],
				leaders: [m("Red Dragon Wyrmling"), c("Kobold Scale Sorcerer")],
				hooks: [
					"A tripwire rings a bell somewhere deeper in the ruins.",
					"Kobolds pelt the party from murder holes.",
				],
			},
			{
				id: "dungeon-oozes",
				name: "Oozes & Lurkers",
				disposition: "neutral",
				minions: [m("Gray Ooze"), m("Stirge"), m("Rust Monster")],
				elites: [m("Ochre Jelly"), m("Rust Monster"), m("Mimic")],
				leaders: [m("Gelatinous Cube"), m("Black Pudding")],
				hooks: [
					"The corridor is suspiciously clean.",
					"That treasure chest has teeth.",
				],
			},
			{
				id: "dungeon-explorers",
				name: "Rival Adventurers",
				disposition: "neutral",
				minions: [r("Scout"), m("Thug"), c("Acolyte"), c("Apprentice Wizard")],
				elites: [m("Veteran"), r("Archer"), c("Priest"), m("Swashbuckler")],
				leaders: [m("Knight"), c("Mage"), m("Champion"), c("Evoker")],
				hooks: [
					"Another adventuring party has the same map — and got here first.",
					"Rivals offer to split the loot... for now.",
				],
			},
		],
	},
];
