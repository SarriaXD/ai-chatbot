import { Message } from 'ai'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'

export const saveHistories = async (
    userId: string,
    chatId: string,
    messages: Message[]
) => {
    await fetchWithToken(`api/chat/histories`, {
        method: 'PUT',
        body: JSON.stringify({
            userId,
            chatId: chatId,
            messages: JSON.stringify(messages),
        }),
    })
}

export const createChat = async (userId: string, initialMessage: string) => {
    const response = await fetchWithToken(`api/chat/histories`, {
        method: 'POST',
        body: JSON.stringify({
            userId,
            initialMessage,
        }),
    })
    return response.json()
}
