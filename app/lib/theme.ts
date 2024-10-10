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
      DEFAULT: "hsl(var(--primary))",
      foreground: "hsl(var(--primary-foreground))",
      // 50: "hsl(200, 10%, 97%)",
      // 100: "hsl(200, 10%, 92%)",
      // 200: "hsl(200, 10%, 87%)",
      // 300: "hsl(200, 10%, 82%)",
      // 400: "hsl(200, 10%, 77%)",
      // 500: "hsl(100, 10%, 72%)",
      // 600: "hsl(200, 10%, 67%)",
      // 700: "hsl(200, 10%, 62%)",
      // 800: "hsl(200, 10%, 57%)",
      // 900: "hsl(200, 10%, 52%)",
      // 950: "hsl(200, 10%, 47%)",
      // foreground: "hsl(165.6, 19.1%, 74.3%)",
      //#2b4f50
    },
    secondary: {
      DEFAULT: "hsl(var(--secondary))",
      foreground: "hsl(var(--secondary-foreground))",
    },

    destructive: {
      DEFAULT: "hsl(var(--destructive))", 
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
