import { Header } from '@ui/header.tsx'
import React from 'react'
import Chat from '@ui/chat/chat.tsx'

export default function Page() {
    return (
        <>
            <Header />
            <main className="size-full">
                <Chat />
            </main>
        </>
    )
}