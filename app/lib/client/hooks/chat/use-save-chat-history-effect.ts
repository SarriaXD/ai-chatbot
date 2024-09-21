import { useEffect } from 'react'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { toast } from 'react-toastify'
import { User } from 'firebase/auth'
import { Message } from 'ai'

// save the user's chat history
const useSaveChatHistoryEffect = ({
    user,
    chatId,
    title,
    messages,
    status,
}: {
    user: User | null
    chatId?: string
    title?: string
    messages: Message[]
    status: 'in_progress' | 'awaiting_message'
}) => {
    useEffect(() => {
        if (
            user &&
            chatId &&
            messages.length > 0 &&
            status === 'awaiting_message'
        ) {
            chatApiClient
                .saveHistories({
                    chatId,
                    messages,
                    title,
                })
                .catch(() => {
                    toast.error("something went wrong, we're working on it")
                })
        }
    }, [messages, chatId, user, status, title])
}

export default useSaveChatHistoryEffect
