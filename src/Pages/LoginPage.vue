<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "@/Module/User/store/useUserStore";
import GoogleSignInButton from "@/Module/Profile/GoogleSignInButton.vue";

const router = useRouter();
const userStore = useUserStore();

const activeTab = ref<"login" | "register">("login");

const loginForm = reactive({ identifier: "", password: "" });
const registerForm = reactive({ username: "", email: "", password: "" });

const isSubmitting = ref(false);
const error = ref("");

function goBack() {
	if (window.history.state?.back) {
		router.back();
	} else {
		router.push({ name: "dashboard" });
	}
}

function selectTab(tab: "login" | "register") {
	activeTab.value = tab;
	error.value = "";
}

async function handleLogin() {
	error.value = "";
	isSubmitting.value = true;
	try {
		await userStore.login(loginForm);
		router.push({ name: "dashboard" });
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Login failed. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
}

async function handleRegister() {
	error.value = "";
	isSubmitting.value = true;
	try {
		await userStore.register(registerForm);
		router.push({ name: "dashboard" });
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Registration failed. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
}

async function handleGoogleSuccess(idToken: string) {
	error.value = "";
	try {
		await userStore.loginWithGoogle(idToken);
		router.push({ name: "dashboard" });
	} catch (e) {
		error.value = e instanceof Error ? e.message : "Google sign-in failed. Please try again.";
	}
}

function handleGoogleError(message: string) {
	error.value = message;
}
</script>

<template>
	<div class="relative rounded-lg border border-border bg-bg-elev p-8 shadow-lg">
		<button
			type="button"
			class="absolute top-4 right-4 grid h-7 w-7 place-items-center rounded-full text-ink-mute hover:bg-bg-elev-2 hover:text-ink transition-colors"
			aria-label="Close"
			@click="goBack"
		>
			✕
		</button>

		<div class="text-center mb-6">
			<div class="brand-mark mx-auto mb-4">D</div>
			<h1 class="text-2xl font-display font-semibold text-ink mb-1">
				{{ activeTab === "login" ? "Welcome back" : "Create your account" }}
			</h1>
			<p class="text-sm text-ink-mute">
				{{
					activeTab === "login"
						? "Sign in to your D&D Toolkit account"
						: "Join D&D Toolkit to save your parties and encounters"
				}}
			</p>
		</div>

		<div class="grid grid-cols-2 gap-1 rounded-lg bg-bg p-1 mb-6">
			<button
				type="button"
				class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
				:class="activeTab === 'login' ? 'bg-accent text-bg' : 'text-ink-mute hover:text-ink'"
				@click="selectTab('login')"
			>
				Log in
			</button>
			<button
				type="button"
				class="rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
				:class="activeTab === 'register' ? 'bg-accent text-bg' : 'text-ink-mute hover:text-ink'"
				@click="selectTab('register')"
			>
				Register
			</button>
		</div>

		<GoogleSignInButton @success="handleGoogleSuccess" @error="handleGoogleError" />

		<div class="flex items-center gap-3 my-5">
			<div class="h-px flex-1 bg-border" />
			<span class="text-xs text-ink-faint">or</span>
			<div class="h-px flex-1 bg-border" />
		</div>

		<form v-if="activeTab === 'login'" class="space-y-4" @submit.prevent="handleLogin">
			<div>
				<label for="identifier" class="block text-xs text-ink-mute mb-1.5">Username or email</label>
				<input
					id="identifier"
					v-model="loginForm.identifier"
					type="text"
					required
					autocomplete="username"
					class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-xs text-ink-mute mb-1.5">Password</label>
				<input
					id="password"
					v-model="loginForm.password"
					type="password"
					required
					autocomplete="current-password"
					class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					placeholder="••••••••"
				/>
			</div>

			<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

			<button
				type="submit"
				:disabled="isSubmitting"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
			>
				{{ isSubmitting ? "Signing in…" : "Sign in" }}
			</button>
		</form>

		<form v-else class="space-y-4" @submit.prevent="handleRegister">
			<div>
				<label for="username" class="block text-xs text-ink-mute mb-1.5">Username</label>
				<input
					id="username"
					v-model="registerForm.username"
					type="text"
					required
					autocomplete="username"
					class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					placeholder="your-handle"
				/>
			</div>

			<div>
				<label for="reg-email" class="block text-xs text-ink-mute mb-1.5">Email</label>
				<input
					id="reg-email"
					v-model="registerForm.email"
					type="email"
					required
					autocomplete="email"
					class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="reg-password" class="block text-xs text-ink-mute mb-1.5">Password</label>
				<input
					id="reg-password"
					v-model="registerForm.password"
					type="password"
					required
					minlength="8"
					autocomplete="new-password"
					class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					placeholder="At least 8 characters"
				/>
			</div>

			<p v-if="error" class="text-sm text-red-400">{{ error }}</p>

			<button
				type="submit"
				:disabled="isSubmitting"
				class="w-full rounded-lg bg-accent px-4 py-2 text-sm font-medium text-bg hover:opacity-90 transition-opacity disabled:opacity-50"
			>
				{{ isSubmitting ? "Creating account…" : "Create account" }}
			</button>
		</form>
	</div>
</template>

<style scoped>
.brand-mark {
	width: 48px;
	height: 48px;
	border-radius: var(--radius);
	background: var(--accent);
	color: var(--bg);
	display: grid;
	place-items: center;
	font-family: var(--font-display);
	font-weight: 700;
	font-size: 22px;
}
</style>
