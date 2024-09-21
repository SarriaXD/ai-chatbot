import { admin } from '@lib/service/config/firebase-admin-config.ts'
import { Message } from 'ai'

const db = admin.firestore()

export async function updateChat(
    userId: string,
    chatId: string,
    messages: Message[]
) {
    try {
        const conversationRef = db
            .collection('users')
            .doc(userId)
            .collection('chats')
            .doc(chatId)

        await conversationRef.set({
            messages,
            updatedAt: new Date(),
        })
    } catch (error) {
        console.error('Error in storeChat:', error)
        throw error
    }
}

export async function getChat(userId: string, chatId: string) {
    const chatRef = db
        .collection('users')
        .doc(userId)
        .collection('chats')
        .doc(chatId)
    const doc = await chatRef.get()

    if (!doc.exists) {
        return null
    }

    return doc.data()
}

export async function getChatsPaginated(
    userId: string,
    pageSize: number,
    pageNumber: number
) {
    const skip = (pageNumber - 1) * pageSize

    const query = db
        .collection('users')
        .doc(userId)
        .collection('chats')
        .orderBy('updatedAt', 'desc')
        .limit(pageSize)
        .offset(skip)

    const snapshot = await query.get()
    const chats = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data().title,
    }))

    const totalQuery = db.collection('users').doc(userId).collection('chats')

    const totalSnapshot = await totalQuery.count().get()
    const totalCount = totalSnapshot.data().count

    return {
        chats,
        pageNumber,
        pageSize,
        totalCount,
        totalPages: Math.ceil(totalCount / pageSize),
    }
}
