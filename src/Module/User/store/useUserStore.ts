import { profileApi } from "@/Module/Profile/api/profileApi";
import type {
	IAuthResponse,
	ILoginCredentials,
	IRegisterCredentials,
	IUser,
} from "@/Module/Profile/types";
import { isAxiosError } from "axios";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

const SESSION_STORAGE_KEY = "dnd_session";

interface StoredSession {
	accessToken: string;
	user: IUser;
}

function loadStoredSession(): StoredSession | null {
	try {
		const raw = localStorage.getItem(SESSION_STORAGE_KEY);
		return raw ? (JSON.parse(raw) as StoredSession) : null;
	} catch {
		return null;
	}
}

function persistSession(session: StoredSession) {
	localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
}

function clearStoredSession() {
	localStorage.removeItem(SESSION_STORAGE_KEY);
}

function errorMessage(result: unknown, fallback: string): string {
	if (isAxiosError(result)) {
		return (result.response?.data as { error?: string } | undefined)?.error ?? fallback;
	}
	return fallback;
}

export const useUserStore = defineStore("userStore", () => {
	// Hydrate synchronously from localStorage so a page refresh doesn't have
	// to wait on a network round trip just to know whether we're logged in —
	// the httpOnly refresh cookie can't be relied on for that here since
	// dnd.dev/api.dev are cross-site and the cookie is SameSite=Lax.
	const stored = loadStoredSession();
	const user = ref<IUser | null>(stored?.user ?? null);
	const accessToken = ref<string | null>(stored?.accessToken ?? null);

	const isLoggedIn = computed(() => !!accessToken.value);

	function setSession(response: IAuthResponse) {
		accessToken.value = response.accessToken;
		user.value = response.user;
		persistSession({ accessToken: response.accessToken, user: response.user });
	}

	function clearSession() {
		accessToken.value = null;
		user.value = null;
		clearStoredSession();
	}

	async function login(credentials: ILoginCredentials) {
		const result = await profileApi.login(credentials);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Login failed"));

		setSession(result);
	}

	async function register(credentials: IRegisterCredentials) {
		const result = await profileApi.register(credentials);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Registration failed"));

		setSession(result);
	}

	async function loginWithGoogle(idToken: string) {
		const result = await profileApi.loginWithGoogle(idToken);
		if (isAxiosError(result)) throw new Error(errorMessage(result, "Google sign-in failed"));

		setSession(result);
	}

	// Called by the API client when a request comes back 401 (access token
	// expired mid-session) to try minting a new one from the refresh cookie.
	// Resolves to false instead of throwing so the caller can fall back to
	// logging out.
	async function refresh(): Promise<boolean> {
		const result = await profileApi.refresh();
		if (isAxiosError(result)) return false;

		setSession(result);
		return true;
	}

	async function logout() {
		await profileApi.logout();
		clearSession();
	}

	return {
		user,
		accessToken,
		isLoggedIn,
		login,
		register,
		loginWithGoogle,
		refresh,
		logout,
		clearSession,
	};
});
