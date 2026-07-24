import {
	createRouter,
	createWebHistory,
	type RouteRecordRaw,
} from "vue-router";

import LoginPage from "@/Pages/LoginPage.vue";
import { PageCategories, type PageLayoutKey } from "@/type";
import DashboradPage from "@/Pages/DashboradPage.vue";
import EncounterBuilder from "@/Pages/EncounterBuilder.vue";
import SavedEncountersPage from "@/Pages/SavedEncountersPage.vue";
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
import MapsPage from "@/Pages/MapsPage.vue";
import CombatManager from "@/Pages/CombatManager.vue";

export {};

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
		path: "/encounters",
		name: "encounters",
		component: SavedEncountersPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "overview",
			glyph: "⚔",
			color: "var(--c-rule)",
		},
	},
	{
		path: "/encounters/create",
		name: "encounters-create",
		component: EncounterBuilder,
		meta: {
			layout: "default",
			requiresAuth: true,
			hideFromNav: true,
			category: "overview",
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
		path: "/maps",
		name: "maps",
		component: MapsPage,
		meta: {
			layout: "default",
			requiresAuth: true,
			category: "compendum",
			glyph: "◉",
			color: "var(--c-gear)",
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
			category: "compendum",
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
];

export const router = createRouter({
	history: createWebHistory(),
	routes,
});
