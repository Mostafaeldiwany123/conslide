/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx}',
        './public/**/*.html',
    ],
    theme: {
        extend: {
            colors: {
                surface: {
                    0: '#ffffff',
                    50: '#fafbfc',
                    100: '#f4f5f7',
                    200: '#ebecf0',
                    300: '#dfe1e6',
                    400: '#c1c7d0',
                    500: '#a5adba',
                    600: '#6b778c',
                    700: '#505f79',
                    800: '#344563',
                    900: '#172b4d',
                },
                accent: {
                    50: '#eef2ff',
                    100: '#e0e7ff',
                    200: '#c7d2fe',
                    300: '#a5b4fc',
                    400: '#818cf8',
                    DEFAULT: '#6366f1',
                    600: '#4f46e5',
                    700: '#4338ca',
                    800: '#3730a3',
                },
                emerald: {
                    50: '#ecfdf5',
                    400: '#34d399',
                    500: '#10b981',
                    600: '#059669',
                },
                amber: {
                    50: '#fffbeb',
                    400: '#fbbf24',
                    500: '#f59e0b',
                },
                rose: {
                    50: '#fff1f2',
                    400: '#fb7185',
                    500: '#f43f5e',
                },
                sky: {
                    50: '#f0f9ff',
                    400: '#38bdf8',
                    500: '#0ea5e9',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
            },
            borderRadius: {
                '2xl': '16px',
                '3xl': '20px',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-out',
                'slide-up': 'slideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                'slide-down': 'slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                'pulse-soft': 'pulseSoft 2.5s ease-in-out infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { opacity: '0', transform: 'translateY(8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                slideDown: {
                    '0%': { opacity: '0', transform: 'translateY(-8px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                scaleIn: {
                    '0%': { opacity: '0', transform: 'scale(0.96)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
            },
            boxShadow: {
                'soft': '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
                'medium': '0 4px 12px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
                'elevated': '0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04)',
                'overlay': '0 24px 80px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.06)',
                'ring': '0 0 0 3px rgba(99, 102, 241, 0.12)',
            },
        },
    },
    plugins: [],
};
