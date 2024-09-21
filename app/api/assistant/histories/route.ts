import { updateChat } from '@lib/service/db/db.ts'
import { validateAndDecodeToken } from '@lib/service/utils/validate-token-utils.ts'

// Save or update a chat conversation
export async function POST(request: Request) {
    try {
        const { chatId, messages } = await request.json()
        const token = await validateAndDecodeToken(request)
        if (!chatId || !messages) {
            return new Response(
                JSON.stringify({ error: 'Missing required fields' }),
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' },
                }
            )
        }
        if (!token) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), {
                status: 403,
                headers: { 'Content-Type': 'application/json' },
            })
        }

        const userId = token.uid
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
