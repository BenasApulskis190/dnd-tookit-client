<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_rog" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_rog" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#495562"/><stop offset="1" stop-color="#1b232c"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_rog)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_rog)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <g transform="rotate(30)">
        <path d="M0 -42 C 3.5 -28 4.5 -10 3 2 L -3 2 C -4.5 -10 -3.5 -28 0 -42 Z" fill="#f5e3a3"/>
        <ellipse cx="0" cy="4" rx="9" ry="3.5" fill="#caa23a"/>
        <rect x="-2.5" y="7" width="5" height="14" rx="1" fill="#5a4528"/>
        <circle cx="0" cy="23" r="3.5" fill="#caa23a"/>
      </g>
      <g transform="rotate(-30)">
        <path d="M0 -42 C 3.5 -28 4.5 -10 3 2 L -3 2 C -4.5 -10 -3.5 -28 0 -42 Z" fill="#f5e3a3"/>
        <ellipse cx="0" cy="4" rx="9" ry="3.5" fill="#caa23a"/>
        <rect x="-2.5" y="7" width="5" height="14" rx="1" fill="#5a4528"/>
        <circle cx="0" cy="23" r="3.5" fill="#caa23a"/>
      </g>
    </g>
  </svg>
</template>
