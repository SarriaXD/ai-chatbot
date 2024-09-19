'use client'

import { useState } from 'react'
import Chat from '@ui/chat/chat.tsx'
import ChatSidebar from '@ui/chat/chat-sidebar.tsx'
import useUser from '@lib/client/hooks/use-user.ts'
import { createChat, saveHistories } from '@lib/client/data/fetch-chat.ts'
import { Message } from 'ai'
import { usePathname, useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ChatHeader from '@ui/chat/chat-header.tsx'

export default function Page() {
    const [open, setOpen] = useState(false)
    const { user } = useUser()
    const path = usePathname()
    const chatId = path.replace('/', '')
    const router = useRouter()

    const handleCreateChat = async (message: string) => {
        toast.error('Creating chat...')
        if (!user) return
        try {
            const response = await createChat(user.uid, message)
            router.push(`/${response.id}`)
        } catch (error) {
            console.error(error)
        }
    }

    const handleSaveHistories = async (messages: Message[]) => {
        if (!user) return
        try {
            await saveHistories(user.uid, chatId, messages)
            console.log('Histories saved')
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
                    onCreateNewChat={user ? handleCreateChat : undefined}
                    onSaveHistories={user ? handleSaveHistories : undefined}
                />
            </div>
        </div>
    )
}
