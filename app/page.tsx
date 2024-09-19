'use client'

import { useMemo, useState } from 'react'
import Chat from '@ui/chat/chat.tsx'
import ChatSidebar from '@ui/chat/chat-sidebar.tsx'
import useUser from '@lib/client/hooks/use-user.ts'
import ChatHeader from '@ui/chat/chat-header.tsx'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/navigation'

export default function Page() {
    const [open, setOpen] = useState(false)
    const { user } = useUser()
    const chatId = useMemo(() => uuidv4(), [])
    const router = useRouter()

    const handleCreateChat = () => {
        if (!user) return
        try {
            router.push(`/${chatId}`)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="flex size-full">
            {user && <ChatSidebar open={open} onClose={() => setOpen(false)} />}
            <div className="flex h-screen flex-1 flex-col overflow-hidden">
                <ChatHeader onClickSidebar={() => setOpen(!open)} />
                <Chat
                    chatId={chatId}
                    onCreateNewChat={user ? handleCreateChat : undefined}
                />
            </div>
        </div>
    )
}
