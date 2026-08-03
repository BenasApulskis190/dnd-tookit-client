<script lang="ts" setup>
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

function handleLogout() {
	authStore.logout();
	router.push("/login");
}
</script>

<template>
	<div class="rounded-lg border border-border bg-bg-elev p-6 max-w-md">
		<div class="flex items-center gap-4 mb-6">
			<div class="avatar">{{ user?.name?.[0]?.toUpperCase() ?? "?" }}</div>
			<div>
				<div class="text-lg text-ink font-medium">{{ user?.name }}</div>
				<div class="text-sm text-ink-mute">{{ user?.email }}</div>
			</div>
		</div>

		<!-- TODO: no backend yet - profile fields are read-only until an
		     /auth/me + update-profile endpoint exists -->

		<button
			type="button"
			class="rounded-lg border border-border px-4 py-2 text-sm text-ink hover:bg-bg-elev-2 transition-colors"
			@click="handleLogout"
		>
			Log out
		</button>
	</div>
</template>

<style scoped>
.avatar {
	width: 56px;
	height: 56px;
	border-radius: 50%;
	background: var(--accent);
	color: var(--bg);
	display: grid;
	place-items: center;
	font-family: var(--font-display);
	font-weight: 700;
	font-size: 22px;
}
</style>
