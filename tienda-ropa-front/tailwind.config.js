import palette from '../shared/palette.json'

const neutral = {
    50: palette.canvas,
    100: '#eee8e0',
    200: palette.line,
    300: '#c8bdb0',
    400: '#8b8176',
    500: '#6d645b',
    600: palette.muted,
    700: '#504942',
    800: '#36312c',
    900: palette.ink,
    950: '#171512',
}

const accent = {
    50: '#f4eee5',
    100: palette.sand,
    200: '#ddd0bf',
    300: '#c9ad94',
    400: '#9e7c60',
    500: palette.accent,
    600: '#392f28',
    700: '#2d2520',
    800: palette.ink,
    900: '#201c19',
    950: '#171512',
}

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                canvas: palette.canvas,
                paper: palette.paper,
                sand: palette.sand,
                line: palette.line,
                ink: palette.ink,
                muted: palette.muted,
                focus: palette.focus,
                brand: accent,
                gray: neutral,
                slate: neutral,
                blue: accent,
                indigo: accent,
                purple: accent,
                pink: accent,
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Georgia', 'Times New Roman', 'serif'],
            },
            boxShadow: {
                md: '0 2px 8px rgb(37 34 31 / 0.05)',
                lg: '0 4px 14px rgb(37 34 31 / 0.06)',
                xl: '0 7px 20px rgb(37 34 31 / 0.07)',
                '2xl': '0 8px 24px rgb(37 34 31 / 0.08)',
            },
        },
    },
    plugins: [],
}
