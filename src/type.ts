import DefaultLayout from "@/Module/Layout/DefaultLayout.vue";
import AuthLayout from "@/Module/Layout/AuthLayout.vue";

export const PageLayouts = {
	default: DefaultLayout,
	auth: AuthLayout,
} as const;

//TODO:: add translations
export const PageCategories = {
	overview: "Overview",
	compendum: "Compendium",
} as const;

export type PageLayoutKey = keyof typeof PageLayouts;
export type PageCategories = keyof typeof PageCategories;
