// Compatible with Message. Interface is limited to increase flexibility.
// Only exposed internally.
import {
    Attachment,
    CoreMessage,
    MessageConversionError,
    ToolInvocation,
} from 'ai'
import { attachmentsToParts } from '@lib/service/message/attachments-to-parts.ts'

export type ConvertibleMessage = {
    role:
        | 'system'
        | 'user'
        | 'assistant'
        | 'function' // @deprecated
        | 'data'
        | 'tool' // @deprecated

    content: string
    toolInvocations?: ToolInvocation[]
    experimental_attachments?: Attachment[]
}

/**
 Converts an array of messages from useChat into an array of CoreMessages that can be used
 with the AI core functions (e.g. `streamText`).
 */
export async function convertToCoreMessages(
    messages: Array<ConvertibleMessage>
) {
    const coreMessages: CoreMessage[] = []

    for (const message of messages) {
        const { role, content, toolInvocations, experimental_attachments } =
            message

        if (role === 'system') {
            coreMessages.push({
                role: 'system',
                content,
            })
        } else if (role === 'user') {
            coreMessages.push({
                role: 'user',
                content: experimental_attachments
                    ? [
                          { type: 'text', text: content },
                          ...(await attachmentsToParts(
                              experimental_attachments
                          )),
                      ]
                    : content,
            })
        } else if (role === 'assistant') {
            if (toolInvocations == null) {
                coreMessages.push({ role: 'assistant', content })
                continue
            }

            // assistant message with tool calls
            coreMessages.push({
                role: 'assistant',
                content: [
                    { type: 'text', text: content },
                    ...toolInvocations.map(
                        ({ toolCallId, toolName, args }) => ({
                            type: 'tool-call' as const,
                            toolCallId,
                            toolName,
                            args,
                        })
                    ),
                ],
            })

            // tool message with tool results
            coreMessages.push({
                role: 'tool',
                content: toolInvocations.map((ToolInvocation) => {
                    if (!('result' in ToolInvocation)) {
                        throw new MessageConversionError({
                            originalMessage: message,
                            message:
                                'ToolInvocation must have a result: ' +
                                JSON.stringify(ToolInvocation),
                        })
                    }

                    const { toolCallId, toolName, args, result } =
                        ToolInvocation

                    return {
                        type: 'tool-result' as const,
                        toolCallId,
                        toolName,
                        args,
                        result,
                    }
                }),
            })
        }
    }

    return coreMessages
}
