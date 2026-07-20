<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_ran" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_ran" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#6f8038"/><stop offset="1" stop-color="#313e18"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_ran)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_ran)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(78,80)">
      <path d="M16 -44 C -22 -22 -22 22 16 44" fill="none" stroke="#f5e3a3" stroke-width="6" stroke-linecap="round"/>
      <line x1="16" y1="-44" x2="16" y2="44" stroke="#b78a2a" stroke-width="1.6"/>
      <line x1="-20" y1="0" x2="32" y2="0" stroke="#f5e3a3" stroke-width="3.5"/>
      <path d="M40 0 L30 -7 L30 7 Z" fill="#f5e3a3"/>
      <path d="M-20 0 L-12 -6 M-20 0 L-12 6 M-14 0 L-6 -6 M-14 0 L-6 6" stroke="#f5e3a3" stroke-width="2" fill="none"/>
    </g>
  </svg>
</template>
