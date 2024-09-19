import { createChat, getChat, updateChat } from '@lib/service/db/db.ts'
import { validateAndDecodeToken } from '@lib/service/utils/validate-token-utils.ts'

export async function PUT(request: Request) {
    try {
        const { userId, chatId, messages } = await request.json()
        const token = await validateAndDecodeToken(request)
        if (!userId || !chatId || !messages) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }
        if (!token || token.uid !== userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        await updateChat(userId, chatId, messages)

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error storing conversation:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}

export async function POST(request: Request) {
    try {
        const { userId, initialMessage } = await request.json()
        const token = await validateAndDecodeToken(request)
        if (!userId || !initialMessage) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }
        if (!token || token.uid !== userId) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const chat = await createChat(userId, initialMessage)

        return new Response(JSON.stringify(chat), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        })
    } catch (error) {
        console.error('Error creating conversation:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error' }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }
}

export async function GET(request: Request) {
    try {
        const token = await validateAndDecodeToken(request)
        if (!token) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const params = new URL(request.url).searchParams
        const userId = params.get('userId')
        const chatId = params.get('chatId')

        if (!userId || !chatId || token.uid !== userId) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }

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
