/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./app/**/*.{js,ts,jsx,tsx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: 'var(--border)',
                input: 'var(--input)',
                ring: 'var(--ring)',
                background: 'var(--background)',
                foreground: 'var(--foreground)',
                card: 'var(--card)',
                'card-foreground': 'var(--card-foreground)',
                popover: 'var(--popover)',
                'popover-foreground': 'var(--popover-foreground)',
                primary: 'var(--primary)',
                'primary-foreground': 'var(--primary-foreground)',
                secondary: 'var(--secondary)',
                'secondary-foreground': 'var(--secondary-foreground)',
                muted: 'var(--muted)',
                'muted-foreground': 'var(--muted-foreground)',
                accent: 'var(--accent)',
                'accent-foreground': 'var(--accent-foreground)',
                destructive: 'var(--destructive)',
                sidebar: 'var(--sidebar)',
                'sidebar-foreground': 'var(--sidebar-foreground)',
                'sidebar-primary': 'var(--sidebar-primary)',
                'sidebar-primary-foreground': 'var(--sidebar-primary-foreground)',
                'sidebar-accent': 'var(--sidebar-accent)',
                'sidebar-accent-foreground': 'var(--sidebar-accent-foreground)',
                'sidebar-border': 'var(--sidebar-border)',
                'sidebar-ring': 'var(--sidebar-ring)',
                chart1: 'var(--chart-1)',
                chart2: 'var(--chart-2)',
                chart3: 'var(--chart-3)',
                chart4: 'var(--chart-4)',
                chart5: 'var(--chart-5)',
            },
            borderRadius: {
                sm: 'var(--radius-sm)',
                md: 'var(--radius-md)',
                lg: 'var(--radius-lg)',
                xl: 'var(--radius-xl)',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.black'), // текст по умолчанию — черный
                        table: {
                            marginLeft: 'auto',
                            marginRight: 'auto',
                            width: '100% !important',
                            borderCollapse: 'collapse',
                            marginTop: '1.5em',
                            marginBottom: '1.5em',
                            overflowX: 'auto',
                            display: 'block',
                        },
                        'th, td': {
                            border: '1px  solid #ddd',
                            padding: '0.75em 1em',
                            color: theme('colors.black'), // текст внутри таблиц — черный
                            textAlign: 'center',

                        },
                        th: {
                            // backgroundColor: '#e0e7ff',
                            fontWeight: '600',
                            textAlign: 'center',
                        },
                        'tr:nth-child(even)': {
                            // backgroundColor: '#f9fafb',
                        },
                        'h1, h2, h3, h4, h5': {
                            fontWeight: 'normal', // или 600, как нужно
                            color: '#000000',
                            marginTop: '0',

                        },
                        h1: {
                            fontSize: '2.25rem',
                            lineHeight: '2.5rem',
                        },
                        h2: {
                            fontSize: '1.875rem',
                            lineHeight: '2.25rem',
                        },
                        h3: {
                            fontSize: '1.5rem',
                            lineHeight: '2rem',
                        },
                        h4: {
                            fontSize: '1.25rem',
                            lineHeight: '1.75rem',
                        },
                        h5: {
                            fontSize: '1.125rem',
                            lineHeight: '1.5rem',
                        },
                    },
                },
            }),

        },
        screens: {
            sm: "365px",
            md: "768px",
            lg: "1024px",
            xl: "1280px",
            "2xl": "1536px",
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
