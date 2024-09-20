import { AssistantResponse } from 'ai'
import OpenAI from 'openai'
import getWeatherData from '@lib/service/utils/weather-utils.ts'
import { retrieveSearch, tavilySearch } from '@lib/service/utils/search-utils.ts'

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY || '',
})

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    // Parse the request body
    const input: {
        threadId: string | null;
        message: string;
    } = await req.json()

    // Create a thread if needed
    const threadId = input.threadId ?? (await openai.beta.threads.create({})).id

    // Add a message to the thread
    const createdMessage = await openai.beta.threads.messages.create(threadId, {
        role: 'user',
        content: input.message,
    })

    return AssistantResponse(
        { threadId, messageId: createdMessage.id },
        async ({ forwardStream, sendDataMessage }) => {
            // Run the assistant on the thread
            const runStream = openai.beta.threads.runs.stream(threadId, {
                assistant_id:
                    'asst_A6raLiYj0qNbIqlKNRzCRePj',
            })

            // forward run status would stream message deltas
            let runResult = await forwardStream(runStream)

            // status can be: queued, in_progress, requires_action, cancelling, cancelled, failed, completed, or expired
            while (
                runResult?.status === 'requires_action' &&
                runResult.required_action?.type === 'submit_tool_outputs'
                ) {
                const tool_outputs_promises =
                    runResult.required_action.submit_tool_outputs.tool_calls.map(
                        async (toolCall: any) => {
                            const parameters = JSON.parse(toolCall.function.arguments)
                            let tool_output
                            switch (toolCall.function.name) {
                                // configure your tool calls here
                                case 'get_weather':
                                    sendDataMessage({
                                        role: 'data',
                                        data: 'getting weather data',
                                    })
                                    tool_output = await getWeatherData(parameters.city, parameters.language)
                                    sendDataMessage({
                                        role: 'data',
                                        data: JSON.stringify(tool_output),
                                    })
                                    return {
                                        tool_call_id: toolCall.id,
                                        output: JSON.stringify(tool_output),
                                    }
                                case 'search':
                                    console.log('search', parameters)
                                    return {
                                        tool_call_id: toolCall.id,
                                        output: JSON.stringify(await tavilySearch(parameters.query)),
                                    }
                                case 'retrieve':
                                    console.log('retrieve', parameters)
                                    return {
                                        tool_call_id: toolCall.id,
                                        output: JSON.stringify(await retrieveSearch(parameters.url)),
                                    }
                                default:
                                    throw new Error(
                                        `Unknown tool call function: ${toolCall.function.name}`,
                                    )
                            }
                        },
                    )
                const tool_outputs = await Promise.all(tool_outputs_promises)

                runResult = await forwardStream(
                    openai.beta.threads.runs.submitToolOutputsStream(
                        threadId,
                        runResult.id,
                        { tool_outputs },
                    ),
                )
            }
        },
    )
}