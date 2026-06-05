<script lang="ts" setup>
import { onMounted } from "vue";

onMounted(async () => {
	try {
		const res = await fetch("http://localhost:3000/hello");
		const data = await res.text();
		console.log(data);
	} catch (e) {
		console.log(e);
	}
});
</script>

<template>
	<h1>dashborad</h1>
</template>
