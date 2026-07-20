<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_wiz" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_wiz" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#356a9c"/><stop offset="1" stop-color="#142d49"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_wiz)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_wiz)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <path d="M0 -46 C 8 -24 20 4 32 24 L -32 24 C -20 4 -8 -24 0 -46 Z" fill="#f5e3a3"/>
      <ellipse cx="0" cy="26" rx="40" ry="8.5" fill="#f5e3a3"/>
      <rect x="-26" y="17" width="52" height="6" rx="3" fill="#caa23a"/>
      <path d="M0 -16 L3.6 -5.8 L14.4 -5.6 L5.7 0.9 L9.1 11.1 L0 4.6 L-9.1 11.1 L-5.7 0.9 L-14.4 -5.6 L-3.6 -5.8 Z" fill="#142d49"/>
    </g>
  </svg>
</template>
