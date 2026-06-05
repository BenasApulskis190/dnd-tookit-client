<script lang="ts" setup>
import { Drawer as PrimeDrawer } from "primevue";
</script>

<template>
	<PrimeDrawer v-bind="$attrs">
		<slot />
	</PrimeDrawer>
</template>
