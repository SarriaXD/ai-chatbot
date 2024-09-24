import { Message } from 'ai'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import {
    collection,
    limit,
    onSnapshot,
    orderBy,
    query,
} from 'firebase/firestore'
import { firestore, storage } from '@lib/client/config/firebase-config.ts'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'

const saveMessage = async ({
    chatId,
    message,
    title,
}: {
    chatId: string
    message: Message
    title?: string
}) => {
    return await fetchWithToken(`/api/chat/histories/messages`, {
        method: 'POST',
        body: JSON.stringify({
            chatId,
            message,
            title,
        }),
    })
}

const updateHistory = async ({
    chatId,
    title,
    messages,
}: {
    chatId: string
    title?: string
    messages?: Message[]
}) => {
    return await fetchWithToken(`/api/chat/histories/${chatId}`, {
        method: 'POST',
        body: JSON.stringify({
            title,
            messages,
        }),
    })
}

const fetchHistory = async (
    chatId: string
): Promise<{
    chatId: string
    title?: string
    messages?: Message[]
}> => {
    const result = await fetchWithToken(`/api/chat/histories/${chatId}`)
    return await result.json()
}

const listenHistories = (
    userId: string,
    pageSize: number = 20,
    onHistoriesChange: (
        histories: {
            chatId: string
            title?: string
            updatedAt: Date
        }[]
    ) => void,
    onError: (error: Error) => void
) => {
    const userChatsRef = collection(
        firestore,
        'users',
        userId,
        'chats'
    ).withConverter({
        fromFirestore: (snapshot, options) => {
            const data = snapshot.data(options)
            return {
                chatId: snapshot.id,
                title: data.title,
                updatedAt: data.updatedAt?.toDate(),
            }
        },
        toFirestore: (chat) => chat,
    })
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

const getSuggestion = async (
    question: string
): Promise<{
    question: string
    answer: string
}> => {
    const response = await fetchWithToken(
        `/api/chat/suggestion?question=${question}`
    )
    return await response.json()
}

const uploadFile = async (file: File, userId: string) => {
    let folder
    if (file.type.startsWith('image')) {
        folder = 'images'
    } else if (file.type.startsWith('text')) {
        folder = 'texts'
    } else {
        folder = 'files'
    }
    const storageRef = ref(storage, `${userId}/${folder}/` + file.name)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
}

export const chatApiClient = {
    saveMessage,
    updateHistory,
    fetchHistory,
    listenHistories,
    getSuggestion,
    uploadFile,
}
