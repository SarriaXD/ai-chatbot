import { validateAndDecodeToken } from '@lib/service/utils/validate-token-utils.ts'
import { getChat, updateChat } from '@lib/service/db/db.ts'

// Get a chat conversation
export async function GET(request: Request) {
    try {
        const result = await validateParams(request)
        if (result instanceof Response) {
            return result
        }
        const { userId, chatId } = result
        const chat = await getChat(userId, chatId)

        return new Response(JSON.stringify(chat), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error getting conversation:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}

// update chat
export async function POST(request: Request) {
    try {
        const result = await validateParams(request)
        if (result instanceof Response) {
            return result
        }
        const { userId, chatId } = result
        const { title, messages } = await request.json()
        const chat = await updateChat(userId, chatId, title, messages)

        return new Response(JSON.stringify(chat), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error getting conversation:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}

const validateParams = async (request: Request) => {
    const token = await validateAndDecodeToken(request)
    if (!token) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const chatId = new URL(request.url).pathname.split('/').pop()
    const userId = token.uid

    if (!chatId) {
        return new Response(
            JSON.stringify({ error: 'Missing required fields' }),
            {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }

    return {
        userId,
        chatId,
    }
}
