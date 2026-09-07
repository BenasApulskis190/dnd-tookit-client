<script lang="ts" setup>
import { onMounted, ref } from "vue";

const emit = defineEmits<{
	success: [idToken: string];
	error: [message: string];
}>();

const buttonEl = ref<HTMLDivElement | null>(null);
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
	if (window.google?.accounts?.id) return Promise.resolve();
	if (scriptPromise) return scriptPromise;

	scriptPromise = new Promise((resolve, reject) => {
		const script = document.createElement("script");
		script.src = "https://accounts.google.com/gsi/client";
		script.async = true;
		script.defer = true;
		script.onload = () => resolve();
		script.onerror = () => reject(new Error("Failed to load Google Sign-In"));
		document.head.appendChild(script);
	});
	return scriptPromise;
}

onMounted(async () => {
	if (!GOOGLE_CLIENT_ID) {
		emit("error", "Google sign-in is not configured");
		return;
	}

	try {
		await loadGoogleScript();
	} catch {
		emit("error", "Failed to load Google sign-in");
		return;
	}

	if (!buttonEl.value || !window.google) return;

	window.google.accounts.id.initialize({
		client_id: GOOGLE_CLIENT_ID,
		callback: (response) => emit("success", response.credential),
	});

	window.google.accounts.id.renderButton(buttonEl.value, {
		theme: "filled_black",
		size: "large",
		shape: "pill",
		text: "continue_with",
		width: 296,
	});
});
</script>

<template>
	<div ref="buttonEl" class="flex justify-center" />
</template>
