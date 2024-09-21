import { validateAndDecodeToken } from '@lib/service/utils/validate-token-utils.ts'
import { getChat } from '@lib/service/db/db.ts'

export async function GET(request: Request) {
    try {
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
