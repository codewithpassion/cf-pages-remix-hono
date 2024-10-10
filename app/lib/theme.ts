import type { CustomThemeConfig, PluginAPI } from "tailwindcss/types/config"

export default {
  fontFamily: {
    display: ['Inter', 'system-ui', 'sans-serif'],
    body: ['Inter', 'system-ui', 'sans-serif'],
  },
  backgroundImage: {
    'hero-pattern': `url('/background.png')`,
  },

  colors: {
    border: "hsl(var(--border))",
    input: "hsl(var(--input))",
    ring: "hsl(var(--ring))",
    background: "hsl(var(--background))",
    foreground: "hsl(var(--foreground))",
    primary: {
      DEFAULT: "hsl(181.6, 30.1%, 24.1%)",
      50: "hsl(200, 10%, 97%)",
      100: "hsl(200, 10%, 92%)",
      200: "hsl(200, 10%, 87%)",
      300: "hsl(200, 10%, 82%)",
      400: "hsl(200, 10%, 77%)",
      500: "hsl(100, 10%, 72%)",
      600: "hsl(200, 10%, 67%)",
      700: "hsl(200, 10%, 62%)",
      800: "hsl(200, 10%, 57%)",
      900: "hsl(200, 10%, 52%)",
      950: "hsl(200, 10%, 47%)",
      foreground: "hsl(165.6, 19.1%, 74.3%)",
      //#2b4f50
    },
    secondary: {
      DEFAULT: "hsl(25.2,68.1%,76.7%)", // #ecbd9b
      foreground: "hsl(var(--secondary-foreground))",
      one: "hsl(25.2,68.1%,76.7%)",
      two: "hsl(21.2,44.3%,45.1%)",
      three: "hsl(28.9,47.4%,88.8%)",
      four: "hsl(58.1,17.5%,65.3%)",
      five: "hsl(164.3,9.2%,50.8%)",
    },

    /* Breathout colors

 Primary background: #b1cac4 | hsl(165.6, 19.1%, 74.3%);
 Primary foreground: #2b4f50 | hsl(181.6, 30.1%, 24.1%)

 Secondary:
 one: #ecbd9b   | hsl(25.2, 68.1%, 76.7%)
 two: #a66440   | hsl(21.2, 44.3%, 45.1%)
 three: #f0e2d5 | hsl(28.9, 47.4%, 88.8%)
 four: #b6b597  | hsl(58.1, 17.5%, 65.3%)
 five: #768d87  | hsl(164.3, 9.2%, 50.8%)
 */

    breathe: {
      "primary-foreground": "hsl(165.6, 19.1%, 74.3%)",
      "primary-background": "hsl(181.6, 30.1%, 24.1%)",
      "secondary-one": "hsl(25.2, 68.1%, 76.7%)",
      "secondary-two": "hsl(21.2, 44.3%, 45.1%)",
      "secondary-three": "hsl(28.9, 47.4%, 88.8%)",
      "secondary-four": "hsl(58.1, 17.5%, 65.3%)",
      "secondary-five": "hsl(164.3, 9.2%, 50.8%)",
    },

    destructive: {
      DEFAULT: "hsl(var(--destructive))", // This is #ff4d4f
      foreground: "hsl(var(--destructive-foreground))",
    },
    muted: {
      DEFAULT: "hsl(var(--muted))",
      foreground: "hsl(var(--muted-foreground))",
    },
    accent: {
      DEFAULT: "hsl(var(--accent))",
      foreground: "hsl(var(--accent-foreground))",
    },
    popover: {
      DEFAULT: "hsl(var(--popover))",
      foreground: "hsl(var(--popover-foreground))",
    },
    card: {
      DEFAULT: "hsl(var(--card))",
      foreground: "hsl(var(--card-foreground))",
    },
  },
  borderRadius: {
    lg: "var(--radius)",
    md: "calc(var(--radius) - 2px)",
    sm: "calc(var(--radius) - 4px)",
  },
  keyframes: {
    "accordion-down": {
      from: { height: "0" },
      to: { height: "var(--radix-accordion-content-height)" },
    },
    "accordion-up": {
      from: { height: "var(--radix-accordion-content-height)" },
      to: { height: "0" },
    },
    shimmer: {
      from: {
        backgroundPosition: "0 0",
      },
      to: {
        backgroundPosition: "-200% 0",
      },
    },
  },
  animation: {
    "accordion-down": "accordion-down 0.2s ease-out",
    "accordion-up": "accordion-up 0.2s ease-out",
    shimmer: "shimmer 2s linear infinite",
  },
  typography: ({ theme }: PluginAPI) => {
    return ({
      assistant: {
        h1: {
          fontSize: '1.25rem',
        },
        h2: {
          fontSize: '1.125rem',
        },
        css: {
          '--tw-prose-body': theme('colors.white'),
          '--tw-prose-headings': theme('colors.white'),
          '--tw-prose-counters': theme('colors.white'),
          '--tw-prose-bold': theme('colors.white'),
        },
      },
      human: {
        css: {
          '--tw-prose-body': theme('colors.black.900'),
        },
      },

    })
  },
} as Partial<CustomThemeConfig>
