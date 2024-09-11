import { Header } from '@components/Header.tsx'
import React from 'react'
import ChatContent from './components/ChatContent.tsx'

export default function Page() {
    return (
        <>
            <Header />
            <main className="size-full">
                <ChatContent />
            </main>
        </>
    )
}