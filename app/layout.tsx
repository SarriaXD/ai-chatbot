import React from 'react'
import '@ui/global.css'
import FPSCounter from '@ui/FPS-counter.tsx'
import ToastProvider from '@ui/toast-provider.tsx'
import { Analytics } from '@vercel/analytics/react'
import { Metadata } from 'next'
import { AuthProvider } from '@lib/client/auth-provider.tsx'

// eslint-disable-next-line react-refresh/only-export-components
export const metadata: Metadata = {
    metadataBase: new URL('https://ai-chatbot.sarria.com'),
    icons: {
        icon: '/logo.png',
    },
    description:
        "I'm a mobile and full-stack engineer specializing in app and web development. Explore my portfolio, p",
    title: "Hi, I'm Qi!",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body>
                <AuthProvider>
                    <ToastProvider>
                        <FPSCounter />
                        {children}
                    </ToastProvider>
                    <Analytics />
                </AuthProvider>
            </body>
        </html>
    )
}
