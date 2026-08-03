<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const isSubmitting = ref(false);
const error = ref("");

async function handleSubmit() {
	error.value = "";
	isSubmitting.value = true;

	try {
		// TODO: no backend yet - useAuthStore.login() currently mocks a
		// successful login; swap for a real error once /auth/login exists
		await authStore.login({ email: email.value, password: password.value });
		router.push("/");
	} catch {
		error.value = "Login failed. Please try again.";
	} finally {
		isSubmitting.value = false;
	}
}
</script>

<template>
	<div class="rounded-lg border border-border bg-bg-elev p-8 shadow-lg">
		<div class="text-center mb-8">
			<div class="brand-mark mx-auto mb-4">D</div>
			<h1 class="text-2xl font-display font-semibold text-ink mb-1">
				Welcome back
			</h1>
			<p class="text-sm text-ink-mute">Sign in to your D&D Toolkit account</p>
		</div>

		<form class="space-y-4" @submit.prevent="handleSubmit">
			<div>
				<label for="email" class="block text-xs text-ink-mute mb-1.5">Email</label>
				<input
					id="email"
					v-model="email"
					type="email"
					required
					autocomplete="email"
					class="w-full rounded-lg border border-border bg-bg px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent"
					placeholder="you@example.com"
				/>
			</div>

			<div>
				<label for="password" class="block text-xs text-ink-mute mb-1.5">Password</label>
				<input
					id="password"
					v-model="password"
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
