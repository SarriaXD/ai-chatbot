'use client'

import React, { useState } from 'react'
import Chat from '@ui/chat/chat.tsx'
import ChatHeader from '@ui/chat/chat-header.tsx'
import useUser from '@lib/client/hooks/use-user.ts'
import ChatSidebar from '@ui/chat/chat-sidebar.tsx'
import { usePathname } from 'next/navigation'

export default function Page() {
    const { user } = useUser()
    const [open, setOpen] = useState(false)
    const chatId = usePathname().replace('/', '')
    console.log(chatId)
    return (
        <>
            <main className="flex size-full">
                <ChatSidebar open={open} onClose={() => setOpen(false)} />
                <div className="flex flex-1 flex-col">
                    <ChatHeader onClickSidebar={() => setOpen(!open)} />
                    <Chat userId={user?.uid} chatId={chatId} />
                </div>
            </main>
        </>
    )
}
