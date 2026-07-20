<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_sor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_sor" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#c4582a"/><stop offset="1" stop-color="#631f0c"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_sor)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_sor)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <path d="M0 -46 C 22 -22 20 0 7 16 C 17 14 23 4 23 -8 C 33 8 27 32 3 40 C -21 33 -29 11 -19 -7 C -15 3 -7 6 -3 1 C -15 -15 -9 -31 0 -46 Z" fill="#f5e3a3"/>
      <path d="M2 -16 C 9 -6 7 6 0 15 C -7 7 -7 -5 2 -16 Z" fill="#c4582a"/>
    </g>
  </svg>
</template>
