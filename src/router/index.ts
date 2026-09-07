import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from "vue-router";

import LoginPage from "@/Pages/LoginPage.vue";
import ProfilePage from "@/Pages/ProfilePage.vue";
import { PageCategories, type PageLayoutKey } from "@/type";
import DashboradPage from "@/Pages/DashboradPage.vue";
import EncountersPage from "@/Pages/EncountersPage.vue";
import EncounterDetailPage from "@/Pages/EncounterDetailPage.vue";
import PartiesPage from "@/Pages/PartiesPage.vue";
import CharactersPage from "@/Pages/CharactersPage.vue";
import BestiaryPage from "@/Pages/BestiaryPage.vue";
import MonsterDetailView from "@/Module/Bestiary/MonsterDetailView.vue";
import SpellsPage from "@/Pages/SpellsPage.vue";
import SpellDetailView from "@/Module/Spells/SpellDetailView.vue";
import ConditionsPage from "@/Pages/ConditionsPage.vue";
import ConditionDetailView from "@/Module/Conditions/ConditionDetailView.vue";
import BackgroundsPage from "@/Pages/BackgroundsPage.vue";
import BackgroundDetailView from "@/Module/Backgrounds/BackgroundDetailView.vue";
import FeatsPage from "@/Pages/FeatsPage.vue";
import FeatDetailView from "@/Module/Feats/FeatDetailView.vue";
import ClassesPage from "@/Pages/ClassesPage.vue";
import ClassDetailPage from "@/Pages/ClassDetailPage.vue";
import ItemsPage from "@/Pages/ItemsPage.vue";
import ItemDetailView from "@/Module/Items/ItemDetailView.vue";
import RacesPage from "@/Pages/RacesPage.vue";
import RaceDetailView from "@/Module/Races/RaceDetailView.vue";
import NpcsPage from "@/Pages/NpcsPage.vue";
import NpcDetailView from "@/Module/Npcs/NpcDetailView.vue";
import AdventuresPage from "@/Pages/AdventuresPage.vue";
import AdventureDetailPage from "@/Pages/AdventureDetailPage.vue";
import AdventureSectionPage from "@/Pages/AdventureSectionPage.vue";
import CombatManager from "@/Pages/CombatManager.vue";



declare module "vue-router" {
	interface RouteMeta {
		layout: PageLayoutKey;
		requiresAuth?: boolean;
		hideFromNav?: boolean;
		category: PageCategories;
		glyph?: string;
		color?: string;
	}
}

export const routes: RouteRecordRaw[] = [
	{
		path: "/",
		name: "dashboard",
		component: DashboradPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "overview",
			glyph: "⌂",
			color: "var(--accent)",
		},
	},
	{
		path: "/parties",
		name: "parties",
		component: PartiesPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "play",
			glyph: "☘",
			color: "var(--c-party)",
		},
	},
	{
		path: "/characters",
		name: "characters",
		component: CharactersPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "play",
			glyph: "♜",
			color: "var(--c-character)",
		},
	},
	{
		path: "/encounters",
		name: "encounters",
		component: EncountersPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "play",
			glyph: "⚔",
			color: "var(--c-rule)",
		},
	},
	{
		path: "/encounters/:id",
		name: "encounters-detail",
		component: EncounterDetailPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "play",
		},
	},
	{
		path: "/bestiary",
		name: "bestiary",
		component: BestiaryPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "☠",
			color: "var(--c-monster)",
		},
		children: [
			{
				path: ":id",
				name: "bestiary-detail",
				component: MonsterDetailView,
				meta: {
					layout: "default",
					requiresAuth: true,
					category: "compendum",
				},
			},
		],
	},
	{
		path: "/spells",
		name: "spells",
		component: SpellsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "✦",
			color: "var(--c-spell)",
		},
		children: [
			{
				path: ":id",
				name: "spells-detail",
				component: SpellDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/conditions",
		name: "conditions",
		component: ConditionsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "⚡",
			color: "var(--c-condition)",
		},
		children: [
			{
				path: ":id",
				name: "conditions-detail",
				component: ConditionDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/backgrounds",
		name: "backgrounds",
		component: BackgroundsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "⛩",
			color: "var(--c-background)",
		},
		children: [
			{
				path: ":id",
				name: "backgrounds-detail",
				component: BackgroundDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/feats",
		name: "feats",
		component: FeatsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "★",
			color: "var(--c-feat)",
		},
		children: [
			{
				path: ":id",
				name: "feats-detail",
				component: FeatDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/classes",
		name: "classes",
		component: ClassesPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "⚜",
			color: "var(--c-class)",
		},
	},
	{
		// Classes carry far more than a drawer can hold (features + every
		// subclass), so the detail is its own full page rather than an overlay.
		path: "/classes/:id",
		name: "classes-detail",
		component: ClassDetailPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "compendum",
		},
	},
	{
		path: "/items",
		name: "items",
		component: ItemsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "◈",
			color: "var(--c-item)",
		},
		children: [
			{
				path: ":id",
				name: "items-detail",
				component: ItemDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/races",
		name: "races",
		component: RacesPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "❖",
			color: "var(--c-race)",
		},
		children: [
			{
				path: ":id",
				name: "races-detail",
				component: RaceDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/npcs",
		name: "npcs",
		component: NpcsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "♟",
			color: "var(--c-npc)",
		},
		children: [
			{
				path: ":id",
				name: "npcs-detail",
				component: NpcDetailView,
				meta: { layout: "default", requiresAuth: true, category: "compendum" },
			},
		],
	},
	{
		path: "/adventures",
		name: "adventures",
		component: AdventuresPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "⚑",
			color: "var(--c-adventure)",
		},
	},
	{
		// Adventures carry chapters + NPCs, far more than a drawer can hold, so
		// the detail is its own full page (mirrors the Classes pattern).
		path: "/adventures/:id",
		name: "adventures-detail",
		component: AdventureDetailPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "compendum",
		},
	},
	{
		path: "/adventures/:id/sections/:ordinal",
		name: "adventures-section",
		component: AdventureSectionPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "compendum",
		},
	},
	{
		path: "/combat/:id",
		name: "combat",
		component: CombatManager,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "play",
		},
	},
	{
		path: "/login",
		name: "login",
		component: LoginPage,
		meta: {
			layout: "auth",
			hideFromNav: true,
			category: "compendum",
		},
	},
	{
		path: "/profile",
		name: "profile",
		component: ProfilePage,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "overview",
		},
	},
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
