<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_pal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_pal" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#2f5d8e"/><stop offset="1" stop-color="#1a3a5e"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_pal)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_pal)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <g fill="#f5e3a3" opacity="0.5">
        <path d="M0 -46 L6 -32 L-6 -32 Z"/><path d="M-22 -42 L-9 -32 L-20 -27 Z"/><path d="M22 -42 L9 -32 L20 -27 Z"/>
      </g>
      <path d="M0 -34 L30 -25 V2 C30 26 0 40 0 40 C0 40 -30 26 -30 2 V-25 Z" fill="#f5e3a3"/>
      <g fill="#1a3a5e"><rect x="-4.5" y="-20" width="9" height="44" rx="1.5"/><rect x="-16" y="-6" width="32" height="9" rx="1.5"/></g>
    </g>
  </svg>
</template>
