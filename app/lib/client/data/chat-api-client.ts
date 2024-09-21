import { Message } from 'ai'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore'
import { db } from '@lib/client/config/firebase-config.ts'
// import { Timestamp } from 'firebase/firestore'

const saveHistories = async (chatId: string, messages: Message[]) => {
    return await fetchWithToken(`/api/assistant/histories`, {
        method: 'POST',
        body: JSON.stringify({
            chatId: chatId,
            messages,
        }),
    })
}

const fetchHistory = async (chatId: string) => {
    const result = await fetchWithToken(`/api/assistant/histories/${chatId}`)
    return await result.json()
}

// const fetchHistories = async (
//     pageSize: number,
//     pageNumber: number = 1
// ): Promise<{ chatId: string; updatedA: Timestamp; title?: string }[]> => {
//     const queryParams = new URLSearchParams({
//         pageSize: pageSize.toString(),
//         pageNumber: pageNumber.toString(),
//     })
//     const url = `/api/assistant/histories?${queryParams.toString()}`
//
//     const result = await fetchWithToken(url, {
//         method: 'GET',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     })
//     return result.json()
// }

const listenHistories = (
    userId: string,
    pageSize: number = 20,
    onHistoriesChange: (
        histories: { id: string; title: string; updatedAt: Date }[]
    ) => void,
    onError: (error: Error) => void
) => {
    const userChatsRef = collection(db, 'users', userId, 'chats').withConverter(
        {
            fromFirestore: (snapshot, options) => {
                const data = snapshot.data(options)
                return {
                    id: snapshot.id,
                    title: data.title,
                    updatedAt: data.updatedAt?.toDate(),
                }
            },
            toFirestore: (chat) => chat,
        }
    )
    const q = query(userChatsRef, orderBy('updatedAt', 'desc'), limit(pageSize))
    return onSnapshot(
        q,
        (snapshot) => {
            const updatedChats = snapshot.docs.map((doc) => doc.data())
            onHistoriesChange(updatedChats)
        },
        (error) => {
            onError(error)
        }
    )
}

export const chatApiClient = {
    saveHistories,
    fetchHistory,
    // fetchHistories,
    listenHistories,
}
