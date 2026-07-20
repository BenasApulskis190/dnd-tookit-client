<script lang="ts" setup>
defineProps<{ size?: number }>()
</script>

<template>
  <svg :width="size ?? 64" :height="size ?? 64" viewBox="0 0 160 160">
    <defs>
      <linearGradient id="rim_art" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f4dd8c"/><stop offset="0.5" stop-color="#caa23a"/><stop offset="1" stop-color="#8a6a1c"/></linearGradient>
      <radialGradient id="en_art" cx="0.5" cy="0.38" r="0.72"><stop offset="0" stop-color="#b0742e"/><stop offset="1" stop-color="#5a3411"/></radialGradient>
    </defs>
    <circle cx="80" cy="80" r="74" fill="url(#rim_art)"/><circle cx="80" cy="80" r="64" fill="#7e6018"/><circle cx="80" cy="80" r="60" fill="url(#en_art)"/><circle cx="80" cy="80" r="60" fill="none" stroke="#f5e3a3" stroke-width="1.5" opacity="0.4"/>
    <g transform="translate(80,80)" fill="#f5e3a3">
      <g transform="rotate(0)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(45)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(90)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(135)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(180)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(225)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(270)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <g transform="rotate(315)"><rect x="-5" y="-44" width="10" height="16" rx="2"/></g>
      <circle r="34"/>
      <circle r="15" fill="#5a3411"/>
      <circle r="8" fill="#f5e3a3"/>
      <path d="M-4 0 H4 M0 -4 V4" stroke="#5a3411" stroke-width="2.4"/>
    </g>
  </svg>
</template>
