import { useEffect } from 'react'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { toast } from 'react-toastify'
import { User } from 'firebase/auth'
import { Message } from 'ai'

// save the user's chat history
const useSaveChatHistoryEffect = (
    user: User | null,
    threadId: string | undefined,
    messages: Message[],
    status: 'in_progress' | 'awaiting_message'
) => {
    useEffect(() => {
        if (
            user &&
            threadId &&
            messages.length > 0 &&
            status === 'awaiting_message'
        ) {
            chatApiClient.saveHistories(threadId, messages).catch(() => {
                toast.error("something went wrong, we're working on it")
            })
        }
    }, [messages, threadId, user, status])
}

export default useSaveChatHistoryEffect
