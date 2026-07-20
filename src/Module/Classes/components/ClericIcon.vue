<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_cler" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_cler" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#d8a23e"/><stop offset="1" stop-color="#8a5a16"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_cler)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_cler)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)" fill="#f6ecd0">
      <g transform="rotate(0)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(45)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(90)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(135)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(180)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(225)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(270)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <g transform="rotate(315)"><path d="M0 -44 L6 -22 L-6 -22 Z"/></g>
      <circle r="18"/>
      <circle r="11" fill="#d8a23e"/>
      <circle r="11" fill="none" stroke="#b07a1e" stroke-width="2"/>
    </g>
  </svg>
</template>
