import { updateChat } from '@lib/service/db/db.ts'
import { validateAndDecodeToken } from '@lib/service/utils/validate-token-utils.ts'
import { convertToCoreMessages, generateText, Message } from 'ai'
import { openai } from '@ai-sdk/openai'

// Save or update a chat conversation
export async function POST(request: Request) {
    try {
        const { chatId, title, messages } = await request.json()
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
        if (!title) {
            const title = await getSummarizedTitle(messages)
            await updateChat(userId, chatId, messages, title)
        } else {
            await updateChat(userId, chatId, messages)
        }

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

// Get a chat summary
const getSummarizedTitle = async (messages: Message[], title?: string) => {
    if (title) return
    const { text } = await generateText({
        model: openai('gpt-4o-mini'),
        prompt: 'Summarize the chat to give a title',
        messages: convertToCoreMessages(messages.slice(0, 4)),
    })
    return text
}
