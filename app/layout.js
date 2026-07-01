import './globals.css'

export const metadata = {
    title: 'ShortLink',
    description: 'Shorten. Share. Simplify.',
}

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet" />
            </head>
            <body>{children}</body>
        </html>
    )
}
