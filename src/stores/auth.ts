import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { profileApi } from "@/Module/Profile/api/profileApi";
import type { ILoginCredentials, IUser } from "@/Module/Profile/types";

const STORAGE_KEY = "auth-user";

function readStoredUser(): IUser | null {
	const raw = localStorage.getItem(STORAGE_KEY);
	return raw ? (JSON.parse(raw) as IUser) : null;
}

export const useAuthStore = defineStore("auth", () => {
	const user = ref<IUser | null>(readStoredUser());

	const isLoggedIn = computed(() => user.value !== null);

	async function login(credentials: ILoginCredentials) {
		// TODO: no backend yet - profileApi.login() has nothing to hit, so we
		// mock a successful login here. Once /auth/login exists, use its
		// response (and let failures reject/throw) instead of this stub.
		await profileApi.login(credentials);

		user.value = {
			id: "mock-user",
			name: credentials.email.split("@")[0] || credentials.email,
			email: credentials.email,
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(user.value));
	}

	function logout() {
		// TODO: no backend yet - call profileApi.logout() once it exists
		user.value = null;
		localStorage.removeItem(STORAGE_KEY);
	}

	return { user, isLoggedIn, login, logout };
});
