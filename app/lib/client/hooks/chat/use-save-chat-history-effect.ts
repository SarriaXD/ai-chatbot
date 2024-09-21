import { useEffect } from 'react'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
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
            const saveHistory = fetchWithToken(`/api/assistant/histories`, {
                method: 'POST',
                body: JSON.stringify({
                    chatId: threadId,
                    messages,
                }),
            })
            saveHistory.catch(() => {
                toast.error("something went wrong, we're working on it")
            })
        }
    }, [messages, threadId, user, status])
}

export default useSaveChatHistoryEffect
