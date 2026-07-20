<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_war" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_war" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#7e3081"/><stop offset="1" stop-color="#341037"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_war)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_war)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <path d="M-44 0 C -22 -24 22 -24 44 0 C 22 24 -22 24 -44 0 Z" fill="#f5e3a3"/>
      <circle r="17" fill="#b85ec0"/>
      <circle r="17" fill="none" stroke="#5a1d5e" stroke-width="2"/>
      <path d="M0 -16 C 4.5 -6 4.5 6 0 16 C -4.5 6 -4.5 -6 0 -16 Z" fill="#341037"/>
      <g stroke="#f5e3a3" stroke-width="2.4" stroke-linecap="round" opacity="0.7">
        <line x1="0" y1="-30" x2="0" y2="-40"/><line x1="0" y1="30" x2="0" y2="40"/>
        <line x1="-38" y1="-14" x2="-46" y2="-20"/><line x1="38" y1="-14" x2="46" y2="-20"/>
      </g>
    </g>
  </svg>
</template>
