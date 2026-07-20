<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_fig" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_fig" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#5e768a"/><stop offset="1" stop-color="#283640"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_fig)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_fig)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <g transform="rotate(40)">
        <path d="M0 -46 L4 -38 L4 8 L-4 8 L-4 -38 Z" fill="#f5e3a3"/>
        <rect x="-14" y="8" width="28" height="5" rx="2" fill="#caa23a"/>
        <rect x="-3" y="13" width="6" height="18" rx="1" fill="#5a4528"/>
        <circle cx="0" cy="33" r="4.5" fill="#caa23a"/>
      </g>
      <g transform="rotate(-40)">
        <path d="M0 -46 L4 -38 L4 8 L-4 8 L-4 -38 Z" fill="#f5e3a3"/>
        <rect x="-14" y="8" width="28" height="5" rx="2" fill="#caa23a"/>
        <rect x="-3" y="13" width="6" height="18" rx="1" fill="#5a4528"/>
        <circle cx="0" cy="33" r="4.5" fill="#caa23a"/>
      </g>
    </g>
  </svg>
</template>
