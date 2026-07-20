<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_dru" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_dru" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#3f7a47"/><stop offset="1" stop-color="#1b3a22"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_dru)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_dru)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)">
      <path d="M0 -44 C 24 -26 24 24 0 44 C -24 24 -24 -26 0 -44 Z" fill="#f5e3a3"/>
      <g stroke="#3f7a47" stroke-width="2.2" fill="none" stroke-linecap="round">
        <line x1="0" y1="-40" x2="0" y2="42"/>
        <line x1="0" y1="-22" x2="15" y2="-30"/><line x1="0" y1="-22" x2="-15" y2="-30"/>
        <line x1="0" y1="-2" x2="19" y2="-9"/><line x1="0" y1="-2" x2="-19" y2="-9"/>
        <line x1="0" y1="18" x2="15" y2="13"/><line x1="0" y1="18" x2="-15" y2="13"/>
      </g>
    </g>
  </svg>
</template>
