'use client'

import ChatSidebar from '@ui/chat/chat-sidebar.tsx'
import ChatHeader from '@ui/chat/chat-header.tsx'
import React, { useState } from 'react'
import { useAuth } from '@lib/client/hooks/use-auth.ts'

const Layout = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuth()
    const [open, setOpen] = useState(!!user)

    return (
        <div className="flex size-full">
            {user && <ChatSidebar open={open} onClose={() => setOpen(false)} />}
            <div className="flex h-screen flex-1 flex-col overflow-hidden">
                <ChatHeader onClickSidebar={() => setOpen(!open)} />
                {children}
            </div>
        </div>
    )
}

export default Layout
