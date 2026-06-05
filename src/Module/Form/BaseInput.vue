<script lang="ts" setup>
import InputText  from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';

defineProps<{
    inputType: 'text' | 'number'
}>();

defineOptions({ inheritAttrs: false });
</script>

<template>
    <InputNumber v-if="inputType === 'number'" v-bind="$attrs" />
    <InputText v-if="inputType === 'text'" v-bind="$attrs" />
</template>