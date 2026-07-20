<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_bard" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_bard" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#6f4a93"/><stop offset="1" stop-color="#2d1a4e"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_bard)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_bard)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <g transform="rotate(-18)">
        <rect x="-2" y="-44" width="6" height="60" rx="2" fill="#f5e3a3"/>
        <rect x="-9" y="-52" width="18" height="12" rx="3" fill="#f5e3a3"/>
        <ellipse cx="2" cy="20" rx="23" ry="27" fill="#f5e3a3"/>
        <circle cx="2" cy="14" r="6.5" fill="#2d1a4e"/>
        <g stroke="#b78a2a" stroke-width="1" opacity="0.6"><line x1="-1" y1="-40" x2="-1" y2="40"/><line x1="2" y1="-42" x2="2" y2="44"/><line x1="5" y1="-40" x2="5" y2="40"/></g>
        <circle cx="-6" cy="-48" r="1.8" fill="#b78a2a"/><circle cx="8" cy="-48" r="1.8" fill="#b78a2a"/>
      </g>
    </g>
  </svg>
</template>
