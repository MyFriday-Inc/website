import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem', // px-6 on mobile (24px)
        sm: '2rem',         // px-8 on sm+ (32px)
        md: '1.5rem',       // px-6 on md+ (24px)
        lg: '2rem',         // px-8 on lg+ (32px)
        xl: '2rem',         // px-8 on xl+ (32px)
      },
    },
    extend: {
      spacing: {
        // This adds the px-6 utility and other spacing values
        '0': '0px',
        '1': '0.25rem',
        '2': '0.5rem',
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '8': '2rem',
        '10': '2.5rem',
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
        '24': '6rem',
        '32': '8rem',
      },
      colors: {
        black: "#000000",
        white: "#ffffff",
        friday: "#17d0be", // Friday logo color
        green: {
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
        },
        gray: {
          300: "#d1d5db",
          400: "#9ca3af",
          500: "#6b7280",
          700: "#374151",
          800: "#1f2937",
          900: "#111827",
        },
      },
    },
  },
  plugins: [],
};

export default config; 