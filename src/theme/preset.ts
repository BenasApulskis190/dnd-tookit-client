import { definePreset } from "@primevue/themes";
import Aura from "@primevue/themes/aura";

// Derived from --color-primary: #CC785C (book-cloth) + palette steps
const primaryPalette = {
  50:  "#FDF6F3",
  100: "#FAE9E2",
  200: "#F2CFC2",
  300: "#E8AD97",
  400: "#DA9275",
  500: "#CC785C", // book-cloth
  600: "#B8624A",
  700: "#964E3C",
  800: "#7A3E30",
  900: "#633226",
  950: "#351811",
};

export const DnDPreset = definePreset(Aura, {
  semantic: {
    primary: primaryPalette,

    colorScheme: {
      light: {
        surface: {
          0:   "#1A1A18",
          50:  "#262624", // --color-bg
          100: "#2E2E2B", // --color-bg-surface
          200: "#363633", // --color-bg-subtle
          300: "#3C3C39", // --color-border
          400: "#525250", // --color-border-strong
          500: "#6A6A66", // --color-content-subtle
          600: "#9E9E9A", // --color-content-muted
          700: "#C4C4C0",
          800: "#D8D8D4",
          900: "#E8E8E4", // --color-content
          950: "#F4F4F0",
        },
        primary: {
          color:           "{primary.500}",
          contrastColor:   "#FFFFFF",
          hoverColor:      "{primary.600}",
          activeColor:     "{primary.700}",
        },
        highlight: {
          background:      "#EBDBBC", // --color-secondary (manilla)
          focusBackground: "#D4A27F", // --color-primary-soft (kraft)
          color:           "#191919",
          focusColor:      "#191919",
        },
        focusRing: {
          color:  "#61AAF2", // --color-focus
          shadow: "none",
        },
        formField: {
          background:       "{surface.50}",
          disabledBackground: "{surface.200}",
          filledBackground:  "{surface.100}",
          filledHoverBackground: "{surface.100}",
          filledFocusBackground: "{surface.100}",
          borderColor:      "{surface.300}",
          hoverBorderColor: "{surface.400}",
          focusBorderColor: "{primary.color}",
          invalidBorderColor: "#BF4D43", // --color-error
          color:            "{surface.900}",
          disabledColor:    "{surface.500}",
          placeholderColor: "{surface.400}",
          invalidPlaceholderColor: "#BF4D43",
          floatLabelColor:  "{surface.500}",
          floatLabelFocusColor: "{primary.color}",
          floatLabelActiveColor: "{surface.500}",
          floatLabelInvalidColor: "#BF4D43",
          iconColor:        "{surface.500}",
          shadow:           "none",
        },
      },
    },
  },
});
