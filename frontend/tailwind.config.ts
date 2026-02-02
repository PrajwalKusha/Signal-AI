import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                upstream: {
                    teal: {
                        DEFAULT: "#00897B",
                        light: "#009688",
                        dark: "#00796B",
                        50: "#E0F2F1",
                        100: "#B2DFDB",
                        200: "#80CBC4",
                        300: "#4DB6AC",
                        400: "#26A69A",
                        500: "#009688",
                        600: "#00897B", // Primary
                        700: "#00796B",
                        800: "#00695C",
                        900: "#004D40",
                    },
                    gray: {
                        50: "#F9FAFB",
                        100: "#F3F4F6", // Main bg
                        200: "#E5E7EB",
                        300: "#D1D5DB", // Borders
                        400: "#9CA3AF",
                        500: "#6B7280", // Secondary text
                        600: "#4B5563",
                        700: "#374151",
                        800: "#1F2937",
                        900: "#111827", // Primary text
                    },
                    yellow: {
                        DEFAULT: "#FBBF24",
                    }
                },
            },
            fontFamily: {
                sans: ['var(--font-sans)'], // Maps to Inter
                mono: ['var(--font-mono)'], // Maps to JetBrains Mono
            },
            animation: {
                'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
            },
        },
    },
    plugins: [],
};
export default config;
