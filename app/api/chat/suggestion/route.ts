import { openai } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Get suggestions for a question
export async function GET(request: Request) {
    const url = new URL(request.url)
    const question = url.searchParams.get('question') || ''
    const model = openai('gpt-4o-mini')
    const answer = await generateText({
        model: model,
        prompt: question,
    })
    return new Response(
        JSON.stringify({
            question: question,
            answer: answer.text,
        }),
        {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        }
    )
}
