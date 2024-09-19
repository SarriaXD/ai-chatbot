'use client'

import React, { useState } from 'react'
import Chat from '@ui/chat/chat.tsx'
import ChatHeader from '@ui/chat/chat-header.tsx'

export default function Page() {
    const [open, setOpen] = useState(false)
    return (
        <div className="flex size-full">
            <div className="flex h-screen flex-1 flex-col overflow-hidden">
                <ChatHeader onClickSidebar={() => setOpen(!open)} />
                <Chat />
            </div>
        </div>
    )
}
