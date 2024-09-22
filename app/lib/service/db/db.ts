import { admin } from '@lib/service/config/firebase-admin-config.ts'
import { Message } from 'ai'
import { firestore } from 'firebase-admin'

const db = admin.firestore()

export async function addMessage(
    userId: string,
    chatId: string,
    message: Message
) {
    try {
        const chatRef = db
            .collection('users')
            .doc(userId)
            .collection('chats')
            .doc(chatId)

        const now = new Date()

        await chatRef.set(
            {
                id: chatId,
                updatedAt: now,
                messages: firestore.FieldValue.arrayUnion(message),
            },
            { merge: true }
        )
    } catch (error) {
        console.error('Error in addMessage:', error)
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
        await chatRef.set({
            id: chatId,
            // Add any other initial fields you want for the chat document
            updatedAt: new Date(),
        })
        return chatRef // Return the reference to the newly created document
    }

    return doc.data()
}

export async function updateChat(
    userId: string,
    chatId: string,
    title?: string,
    messages?: Message[]
) {
    const chatRef = db
        .collection('users')
        .doc(userId)
        .collection('chats')
        .doc(chatId)

    const updateData: any = {
        updatedAt: new Date(),
    }

    if (title !== undefined) {
        updateData.title = title
    }

    if (messages !== undefined) {
        updateData.messages = messages
    }

    await chatRef.set(updateData, { merge: true })
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
