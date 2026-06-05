<script lang="ts" setup>
import MonsterList from "./MonsterList.vue"
import EncounterPanel from "./EncounterPanel.vue"
</script>

<template>
	<div class="flex h-full">
		<div class="w-1/2 border-r border-gray-200 h-full">
			<MonsterList />
		</div>

		<div class="w-1/2 h-full">
			<EncounterPanel />
		</div>
	</div>
</template>
