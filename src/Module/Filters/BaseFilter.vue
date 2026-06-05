<script lang="ts" setup>
import BaseFilterItem from "@/Module/Filters/BaseFilterItem.vue";
import { ref } from "vue";

interface IFilteritem {
	id: string;
	name: string;
	color: "red" | "blue" | "blue";
}

const props = defineProps<{
	items: IFilteritem[];
}>();

const emit = defineEmits<{
	filterSelect: [item: IFilteritem];
}>();

const selectedId = ref<string | null>(null);

const handleClick = (item: IFilteritem) => {
	if (item.id === selectedId.value) {
		return;
	}

	selectedId.value = item.id;
	emit("filterSelect", item);
};
</script>

<template>
	<div class="grid grid-cols-6 gap-3">
		<BaseFilterItem
			v-for="item in items"
			:key="item.id"
			:id="item.id"
            :is-active="selectedId === item.id"
			:name="item.name"
			@click="handleClick(item)"
		/>
	</div>
</template>
