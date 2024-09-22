import { useEffect } from 'react'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { toast } from 'react-toastify'
import { User } from 'firebase/auth'
import { Message } from 'ai'

// save the user's chat history
const useSaveChatHistoryEffect = ({
    user,
    chatId,
    messages,
    isLoading,
}: {
    user: User | null
    chatId: string
    messages: Message[]
    isLoading: boolean
}) => {
    useEffect(() => {
        if (user && !isLoading) {
            chatApiClient
                .saveHistories({
                    chatId,
                    messages,
                })
                .catch(() => {
                    toast.error("something went wrong, we're working on it")
                })
        }
    }, [messages, chatId, user, isLoading])
}

export default useSaveChatHistoryEffect
