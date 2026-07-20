<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_barb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_barb" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#a23a33"/><stop offset="1" stop-color="#4f1512"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_barb)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_barb)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(68,80) rotate(-6)">
      <rect x="-4" y="-42" width="8" height="88" rx="4" fill="#5a4528"/>
      <rect x="-4" y="-42" width="3" height="88" rx="1.5" fill="#7a5f38"/>
      <circle cx="0" cy="44" r="5.5" fill="#f5e3a3"/>
      <path d="M2 -22 L40 -42 C 55 -28 55 8 40 22 L2 6 Z" fill="#f5e3a3"/>
      <path d="M40 -38 C 52 -24 52 6 40 18" fill="none" stroke="#fff5d6" stroke-width="2.4" opacity="0.6"/>
      <path d="M6 -18 L34 -34" fill="none" stroke="#b78a2a" stroke-width="1.6" opacity="0.45"/>
    </g>
  </svg>
</template>
