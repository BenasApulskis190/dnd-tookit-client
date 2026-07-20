<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_monk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_monk" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#2f8b7d"/><stop offset="1" stop-color="#114039"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_monk)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_monk)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,82)">
      <g fill="#f5e3a3">
        <circle cx="-15" cy="-16" r="7"/><circle cx="-5" cy="-19" r="7.5"/><circle cx="5" cy="-19" r="7.5"/><circle cx="15" cy="-16" r="7"/>
        <rect x="-22" y="-18" width="44" height="30" rx="9"/>
        <path d="M-22 -4 C -33 -4 -35 10 -26 15 C -21 17 -19 11 -20 6 Z"/>
        <rect x="-15" y="10" width="30" height="16" rx="5"/>
      </g>
      <g stroke="#b78a2a" stroke-width="1.8" fill="none" opacity="0.55" stroke-linecap="round">
        <line x1="-15" y1="-20" x2="-15" y2="-4"/><line x1="-5" y1="-23" x2="-5" y2="-4"/><line x1="5" y1="-23" x2="5" y2="-4"/><line x1="15" y1="-20" x2="15" y2="-4"/>
      </g>
    </g>
  </svg>
</template>
