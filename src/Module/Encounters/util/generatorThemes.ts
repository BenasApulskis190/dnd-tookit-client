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
			{
				id: "city-assassins",
				name: "Assassins' Guild",
				disposition: "hostile",
				minions: [m("Thug"), r("Spy"), c("Apprentice Wizard")],
				elites: [r("Spy"), m("Swashbuckler"), c("Illusionist"), c("Bard")],
				leaders: [m("Assassin"), m("Master Thief"), c("Enchanter")],
				hooks: [
					"Someone has paid good coin to see the party dead before dawn.",
					"A masquerade ball turns deadly when the lights go out.",
				],
			},
			{
				id: "city-doppelgangers",
				name: "Infiltrators",
				disposition: "hostile",
				minions: [m("Guard"), m("Thug"), m("Cultist")],
				elites: [m("Doppelganger"), r("Spy"), c("Cult Fanatic")],
				leaders: [m("Doppelganger"), c("Rakshasa")],
				hooks: [
					"The party's trusted contact is acting strangely.",
					"Half the city council has been replaced — and they know the party suspects.",
				],
			},
			{
				id: "city-arena",
				name: "Arena Fighters",
				disposition: "neutral",
				minions: [m("Thug"), m("Tribal Warrior"), r("Scout")],
				elites: [m("Gladiator"), m("Berserker"), m("Veteran"), r("Archer")],
				leaders: [m("Gladiator"), m("Champion"), m("Warlord")],
				hooks: [
					"The crowd roars as the party is shoved into the pit.",
					"A prize fight with real stakes — and a rigged opponent.",
				],
			},
			{
				id: "city-tower",
				name: "Wizard's Tower Gone Wrong",
				disposition: "hostile",
				minions: [m("Animated Armor"), m("Flying Sword"), c("Apprentice Wizard"), m("Homunculus")],
				elites: [m("Gargoyle"), c("Mage"), m("Helmed Horror")],
				leaders: [m("Shield Guardian"), m("Flesh Golem"), c("Archmage")],
				hooks: [
					"A failed experiment has animated everything in the tower.",
					"The wizard's apprentice begs the party to stop what they summoned.",
				],
			},
			{
				id: "city-vampire",
				name: "Vampire's Court",
				disposition: "hostile",
				minions: [m("Swarm of Bats"), m("Thug"), m("Cultist")],
				elites: [m("Vampire Spawn"), c("Cult Fanatic"), r("Spy")],
				leaders: [m("Vampire Spawn"), m("Vampire")],
				hooks: [
					"Pale nobles host a party that only happens after midnight.",
					"Bloodless bodies keep turning up in the canals.",
				],
			},
			{
				id: "city-temple",
				name: "Temple Guardians",
				disposition: "friendly",
				minions: [c("Acolyte"), m("Guard")],
				elites: [c("Priest"), m("Knight"), m("Veteran")],
				leaders: [c("War Priest"), m("Champion"), c("Deva")],
				hooks: [
					"Temple guardians test whether the party is worthy of the relic.",
					"A holy order offers aid — if the party passes their trial.",
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
			{
				id: "forest-elves",
				name: "Elven Rangers",
				disposition: "neutral",
				minions: [r("Scout"), m("Guard")],
				elites: [r("Archer"), c("Druid"), m("Veteran")],
				leaders: [r("Archer"), c("Archdruid"), m("Champion")],
				hooks: [
					"Arrows thud into the ground at the party's feet — a warning.",
					"Elven wardens demand to know the party's business in their woods.",
				],
			},
			{
				id: "forest-werewolves",
				name: "Werewolf Hunt",
				disposition: "hostile",
				minions: [m("Wolf"), m("Dire Wolf"), m("Cultist")],
				elites: [m("Werewolf"), m("Dire Wolf"), c("Cult Fanatic")],
				leaders: [m("Werewolf"), m("Wereboar")],
				hooks: [
					"The full moon rises and the howling starts.",
					"A villager with fresh bite marks begs the party to run.",
				],
			},
			{
				id: "forest-spiders",
				name: "Spider Nest",
				disposition: "hostile",
				minions: [m("Giant Wolf Spider"), m("Swarm of Spiders")],
				elites: [r("Giant Spider"), m("Ettercap"), r("Phase Spider")],
				leaders: [r("Phase Spider"), r("Drider")],
				hooks: [
					"Thick webs hang between the trees, holding cocooned shapes.",
					"The forest has gone silent — even the birds are gone.",
				],
			},
			{
				id: "forest-dragon",
				name: "Green Dragon's Domain",
				disposition: "hostile",
				minions: [m("Cultist"), m("Twig Blight"), r("Kobold Inventor")],
				elites: [c("Cult Fanatic"), m("Green Dragon Wyrmling"), c("Druid")],
				leaders: [m("Young Green Dragon"), m("Adult Green Dragon")],
				hooks: [
					"A sickly green mist creeps between the trees.",
					"The dragon's agents offer a 'deal' the party can't refuse.",
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
			{
				id: "desert-elementals",
				name: "Elemental Storm",
				disposition: "hostile",
				minions: [c("Dust Mephit"), m("Fire Snake"), c("Magma Mephit")],
				elites: [m("Air Elemental"), m("Fire Elemental"), m("Salamander")],
				leaders: [c("Efreeti"), m("Fire Elemental"), m("Air Elemental")],
				hooks: [
					"A sandstorm with burning eyes rolls across the dunes.",
					"A cracked brass lamp lies half-buried in the sand.",
				],
			},
			{
				id: "desert-blue-dragon",
				name: "Blue Dragon's Lair",
				disposition: "hostile",
				minions: [m("Kobold"), m("Cultist"), r("Scout")],
				elites: [m("Blue Dragon Wyrmling"), c("Cult Fanatic"), m("Bandit Captain")],
				leaders: [m("Young Blue Dragon"), m("Adult Blue Dragon")],
				hooks: [
					"Lightning strikes the same dune over and over.",
					"A buried city shows signs of recent digging — and claw marks.",
				],
			},
			{
				id: "desert-genie",
				name: "Djinni's Bargain",
				disposition: "friendly",
				minions: [c("Dust Mephit"), m("Commoner"), r("Scout")],
				elites: [m("Air Elemental"), c("Priest"), m("Veteran")],
				leaders: [c("Djinni")],
				hooks: [
					"A whirlwind takes the shape of a laughing figure offering wishes.",
					"A desert oracle insists the party meet her 'patron'.",
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
			{
				id: "mountain-dragon-cult",
				name: "Cult of the Dragon",
				disposition: "hostile",
				minions: [m("Cultist"), m("Kobold"), m("Guard Drake")],
				elites: [c("Cult Fanatic"), m("Red Dragon Wyrmling"), m("Veteran")],
				leaders: [m("Young Red Dragon"), c("Mage")],
				hooks: [
					"Purple-robed cultists are hauling treasure up the mountain.",
					"A shrine to a dragon smokes with fresh offerings.",
				],
			},
			{
				id: "mountain-earth",
				name: "Living Stone",
				disposition: "neutral",
				minions: [m("Gargoyle"), c("Dust Mephit")],
				elites: [m("Xorn"), m("Galeb Duhr"), m("Gargoyle")],
				leaders: [m("Earth Elemental"), m("Xorn")],
				hooks: [
					"The mountainside itself shrugs and stands up.",
					"Miners broke into a vein that something else considers food.",
				],
			},
			{
				id: "mountain-harpies",
				name: "Harpy Cliffs",
				disposition: "hostile",
				minions: [c("Harpy"), m("Blood Hawk"), m("Stirge")],
				elites: [c("Harpy"), m("Peryton"), r("Manticore")],
				leaders: [r("Manticore"), m("Chimera")],
				hooks: [
					"A beautiful song drifts up from the cliff edge.",
					"Bones litter the narrow path beneath a cliff full of nests.",
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
			{
				id: "swamp-black-dragon",
				name: "Black Dragon's Lair",
				disposition: "hostile",
				minions: [m("Lizardfolk"), m("Kobold"), m("Cultist")],
				elites: [m("Black Dragon Wyrmling"), c("Lizardfolk Shaman"), c("Cult Fanatic")],
				leaders: [m("Young Black Dragon"), m("Adult Black Dragon")],
				hooks: [
					"The water here burns like acid.",
					"Lizardfolk bring tribute to a sunken temple.",
				],
			},
			{
				id: "swamp-yuanti",
				name: "Sunken Serpent Temple",
				disposition: "hostile",
				minions: [m("Giant Poisonous Snake"), m("Swarm of Poisonous Snakes"), c("Yuan-ti Pureblood")],
				elites: [c("Yuan-ti Pureblood"), r("Yuan-ti Malison (Type 3)"), m("Yuan-ti Malison (Type 1)")],
				leaders: [c("Yuan-ti Abomination"), m("Yuan-ti Malison (Type 2)")],
				hooks: [
					"A stepped temple rises from the swamp, wreathed in incense.",
					"Snake-headed statues line a sunken causeway.",
				],
			},
			{
				id: "swamp-trolls",
				name: "Troll Bog",
				disposition: "hostile",
				minions: [m("Giant Frog"), m("Bullywug"), m("Ogre")],
				elites: [m("Troll"), m("Ogre")],
				leaders: [m("Troll")],
				hooks: [
					"Massive, regenerating tracks lead into the mire.",
					"A troll demands a toll at the only dry crossing.",
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
			{
				id: "coastal-ghost-ship",
				name: "Ghost Ship",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Shadow")],
				elites: [m("Ghost"), r("Wight"), m("Specter")],
				leaders: [m("Ghost"), m("Wraith"), c("Banshee")],
				hooks: [
					"A ship with tattered sails drifts in through the fog with no crew.",
					"Bells ring from beneath the waves at midnight.",
				],
			},
			{
				id: "coastal-harbor",
				name: "Harbor Watch",
				disposition: "friendly",
				minions: [m("Guard"), m("Commoner"), r("Scout")],
				elites: [m("Veteran"), r("Archer"), c("Priest")],
				leaders: [m("Knight"), c("Mage")],
				hooks: [
					"Dockworkers ask for help unloading a crate that keeps moving.",
					"The harbormaster needs volunteers to inspect a quarantined ship.",
				],
			},
			{
				id: "coastal-sea-hags",
				name: "Sea Hag's Grotto",
				disposition: "hostile",
				minions: [m("Merrow"), m("Giant Crab"), m("Swarm of Quippers")],
				elites: [c("Sea Hag"), m("Merrow"), m("Hunter Shark")],
				leaders: [c("Sea Hag"), m("Giant Octopus")],
				hooks: [
					"Fishermen have been vanishing from the rocks at low tide.",
					"A cave full of drowned dolls glows in the tide.",
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
			{
				id: "arctic-cult",
				name: "Frost Cult",
				disposition: "hostile",
				minions: [m("Cultist"), c("Ice Mephit"), m("Wolf")],
				elites: [c("Cult Fanatic"), c("Priest"), m("Winter Wolf")],
				leaders: [c("Mage"), m("Young White Dragon")],
				hooks: [
					"Cultists of the frost goddess are preparing an endless winter.",
					"Ice sculptures of villagers line the road — too lifelike.",
				],
			},
			{
				id: "arctic-frozen-dead",
				name: "Frozen Dead",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Ghoul")],
				elites: [r("Wight"), m("Ghast"), m("Specter")],
				leaders: [m("Wraith"), r("Wight")],
				hooks: [
					"The thaw has revealed an army frozen in the ice — and it's waking.",
					"A buried longship holds warriors that won't stay dead.",
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
			{
				id: "grassland-knights",
				name: "Knightly Order",
				disposition: "neutral",
				minions: [m("Guard"), r("Scout"), c("Acolyte")],
				elites: [m("Knight"), m("Veteran"), c("Priest")],
				leaders: [m("Champion"), c("War Priest"), m("Warlord")],
				hooks: [
					"A tourney is underway and the knights challenge passing travellers.",
					"Knights hunting a fugitive think the party fits the description.",
				],
			},
			{
				id: "grassland-battlefield",
				name: "Haunted Battlefield",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Warhorse Skeleton")],
				elites: [r("Wight"), m("Ghast"), m("Specter")],
				leaders: [m("Wraith"), m("Death Knight")],
				hooks: [
					"Rusting armour and bones cover an old battlefield — then the bones stand.",
					"Spectral war horns echo across the field at dusk.",
				],
			},
			{
				id: "grassland-bandit-riders",
				name: "Bandit Riders",
				disposition: "hostile",
				minions: [m("Bandit"), r("Scout"), m("Thug")],
				elites: [m("Bandit Captain"), r("Archer"), m("Berserker")],
				leaders: [m("Bandit Captain"), m("Warlord"), c("Mage")],
				hooks: [
					"A dust cloud on the horizon resolves into riders.",
					"Bandits are 'taxing' every caravan on the trade road.",
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
			{
				id: "underdark-duergar",
				name: "Duergar Slavers",
				disposition: "hostile",
				minions: [m("Duergar"), m("Quaggoth"), m("Grimlock")],
				elites: [m("Duergar"), m("Chuul"), c("Nothic")],
				leaders: [m("Duergar"), c("Mind Flayer")],
				hooks: [
					"Chained prisoners shuffle past, driven by grey dwarves.",
					"Duergar want the party as their next shipment.",
				],
			},
			{
				id: "underdark-kuotoa",
				name: "Kuo-toa Shrine",
				disposition: "hostile",
				minions: [m("Kuo-toa"), r("Kuo-toa Whip")],
				elites: [c("Kuo-toa Whip"), m("Kuo-toa Monitor")],
				leaders: [c("Kuo-toa Archpriest")],
				hooks: [
					"Fish-folk chant to a lumpy idol of driftwood and bones.",
					"The kuo-toa have decided the party is their new god's enemy.",
				],
			},
			{
				id: "underdark-gnomes",
				name: "Deep Gnome Miners",
				disposition: "friendly",
				minions: [m("Deep Gnome (Svirfneblin)"), m("Guard")],
				elites: [m("Deep Gnome (Svirfneblin)"), m("Veteran"), c("Priest")],
				leaders: [m("Earth Elemental")],
				hooks: [
					"Deep gnome miners offer safe passage in exchange for help.",
					"A svirfneblin patrol is hiding from something larger.",
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
			{
				id: "dungeon-constructs",
				name: "Animated Guardians",
				disposition: "hostile",
				minions: [m("Animated Armor"), m("Flying Sword"), m("Rug of Smothering")],
				elites: [m("Animated Armor"), m("Gargoyle"), m("Helmed Horror")],
				leaders: [m("Shield Guardian"), m("Stone Golem"), m("Clay Golem")],
				hooks: [
					"The suits of armour lining the hall turn their heads in unison.",
					"A vault door opens — and its guardians step out.",
				],
			},
			{
				id: "dungeon-demons",
				name: "Demonic Summoning",
				disposition: "hostile",
				minions: [m("Dretch"), m("Manes"), m("Cultist")],
				elites: [c("Quasit"), m("Shadow Demon"), m("Vrock"), c("Cult Fanatic")],
				leaders: [m("Hezrou"), c("Glabrezu"), m("Vrock")],
				hooks: [
					"A summoning circle still smokes with sulphur.",
					"Cultists are mid-ritual — and the portal is already opening.",
				],
			},
			{
				id: "dungeon-devils",
				name: "Infernal Contract",
				disposition: "hostile",
				minions: [c("Imp"), m("Lemure"), m("Cultist")],
				elites: [m("Bearded Devil"), r("Spined Devil"), c("Cult Fanatic")],
				leaders: [m("Barbed Devil"), m("Chain Devil"), r("Erinyes"), m("Bone Devil")],
				hooks: [
					"A smiling devil arrives to collect on a contract — with interest.",
					"Hellfire runes flare across the vault door.",
				],
			},
			{
				id: "dungeon-goblin-lair",
				name: "Goblin Warren",
				disposition: "hostile",
				minions: [r("Goblin"), m("Wolf"), m("Hobgoblin")],
				elites: [m("Goblin Boss"), m("Bugbear"), c("Hobgoblin Devastator")],
				leaders: [m("Bugbear Chief"), m("Goblin Boss")],
				hooks: [
					"Cooking smoke and cackling drift up a collapsed stairwell.",
					"The goblins have rigged the ruins with crude but nasty traps.",
				],
			},
		],
	},
	{
		id: "hills",
		name: "Hills",
		themes: [
			{
				id: "hills-trolls",
				name: "Ogres & Trolls",
				disposition: "hostile",
				minions: [r("Goblin"), m("Ogre"), m("Worg")],
				elites: [m("Ogre"), m("Troll"), m("Half-Ogre (Ogrillon)")],
				leaders: [m("Troll"), m("Ettin"), m("Hill Giant")],
				hooks: [
					"A rickety bridge has a very large, very hungry toll-keeper.",
					"Smoke from a cook-fire — and a cauldron big enough for a person.",
				],
			},
			{
				id: "hills-barrows",
				name: "Barrow Wights",
				disposition: "hostile",
				minions: [r("Skeleton"), m("Zombie"), m("Ghoul")],
				elites: [r("Wight"), m("Ghast"), c("Will-o'-Wisp")],
				leaders: [r("Wight"), m("Wraith")],
				hooks: [
					"Grassy burial mounds dot the hills; one stands open.",
					"Grave-robbers ran from the barrows screaming last night.",
				],
			},
			{
				id: "hills-gnolls",
				name: "Gnoll Warren",
				disposition: "hostile",
				minions: [r("Gnoll"), m("Hyena"), r("Gnoll Hunter")],
				elites: [m("Gnoll Pack Lord"), m("Gnoll Flesh Gnawer"), m("Giant Hyena")],
				leaders: [m("Gnoll Fang of Yeenoghu"), m("Flind")],
				hooks: [
					"Cackling echoes from caves in the hillside.",
					"Gnolls have taken the old watchtower on the ridge.",
				],
			},
			{
				id: "hills-halflings",
				name: "Halfling Shire",
				disposition: "friendly",
				minions: [m("Commoner"), r("Scout"), m("Guard")],
				elites: [m("Veteran"), c("Druid"), c("Bard")],
				leaders: [c("Druid"), m("Knight")],
				hooks: [
					"Halflings insist the party stays for second breakfast.",
					"Shire folk need help with a 'small' problem in the cellar.",
				],
			},
		],
	},
	{
		id: "jungle",
		name: "Jungle",
		themes: [
			{
				id: "jungle-dinosaurs",
				name: "Dinosaur Stampede",
				disposition: "neutral",
				minions: [m("Velociraptor"), m("Pteranodon")],
				elites: [m("Allosaurus"), m("Ankylosaurus"), m("Triceratops")],
				leaders: [m("Tyrannosaurus Rex"), m("Triceratops")],
				hooks: [
					"The ground shakes rhythmically. Then faster.",
					"Huge feathered shapes watch from the ferns.",
				],
			},
			{
				id: "jungle-grungs",
				name: "Grung Tribe",
				disposition: "hostile",
				minions: [m("Grung"), c("Grung Wildling")],
				elites: [m("Grung Elite Warrior"), c("Grung Wildling")],
				leaders: [m("Grung Elite Warrior"), c("Lizardfolk Shaman")],
				hooks: [
					"Brightly coloured frog-folk sing a warning from the canopy.",
					"The party touched a grung — and now feels very ill.",
				],
			},
			{
				id: "jungle-beasts",
				name: "Jungle Predators",
				disposition: "neutral",
				minions: [m("Ape"), m("Constrictor Snake"), m("Swarm of Poisonous Snakes"), m("Panther")],
				elites: [m("Tiger"), m("Giant Constrictor Snake"), m("Giant Ape")],
				leaders: [m("Giant Ape"), m("Tyrannosaurus Rex")],
				hooks: [
					"Something large is pacing the party through the undergrowth.",
					"Vines that aren't vines drop from the canopy.",
				],
			},
			{
				id: "jungle-yuanti",
				name: "Lost Temple",
				disposition: "hostile",
				minions: [m("Cultist"), m("Flying Snake"), c("Yuan-ti Pureblood")],
				elites: [c("Yuan-ti Pureblood"), r("Yuan-ti Malison (Type 3)"), c("Cult Fanatic")],
				leaders: [c("Yuan-ti Abomination"), c("Yuan-ti Nightmare Speaker")],
				hooks: [
					"A ziggurat swallowed by vines hums with low chanting.",
					"The idol the party carries is wanted back — by its worshippers.",
				],
			},
			{
				id: "jungle-tribe",
				name: "Jungle Tribe",
				disposition: "friendly",
				minions: [m("Tribal Warrior"), r("Scout")],
				elites: [m("Berserker"), c("Druid")],
				leaders: [c("Druid"), c("Archdruid")],
				hooks: [
					"Painted hunters emerge from the trees with spears lowered.",
					"A tribe offers guidance through the jungle in exchange for a favour.",
				],
			},
		],
	},
];
