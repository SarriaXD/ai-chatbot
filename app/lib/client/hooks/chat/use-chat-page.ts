import { Message } from 'ai'
import { useAuth } from '@lib/client/hooks/use-auth.ts'
import { useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useChat } from 'ai/react'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { useThrottle } from '@uidotdev/usehooks'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import useChatScroll from '@lib/client/hooks/chat/use-chat-scroll.ts'

const useChatPage = ({
    chatId,
    initialMessages,
    onNavigateToChatIdPage,
}: {
    chatId: string
    initialMessages?: Message[]
    onNavigateToChatIdPage?: () => void
}) => {
    const { user } = useAuth()
    const titleLoaded = useRef(false)
    const {
        messages: fasterMessages,
        input,
        isLoading,
        handleSubmit,
        setInput,
        stop,
    } = useChat({
        id: chatId,
        initialMessages: initialMessages,
        fetch: fetchWithToken,
        onError: () => {
            toast.error("something went wrong, we're working on it")
        },
        onFinish: async (message) => {
            if (user) {
                const saveHistory = async () => {
                    return chatApiClient
                        .saveMessage({
                            chatId,
                            message,
                        })
                        .catch(() => {
                            toast.error(
                                "something went wrong, we're working on it"
                            )
                        })
                }
                const updateTitle = async () => {
                    if (!titleLoaded.current) {
                        try {
                            const titlePrompt = `Generate concise unpunctuated chat title from previous response: ${message.content}`
                            const answer =
                                await chatApiClient.getSuggestion(titlePrompt)
                            await chatApiClient.updateHistory({
                                chatId,
                                title: answer.answer,
                            })
                            titleLoaded.current = true
                        } catch (error) {
                            toast.error(`Can not update current title ${error}`)
                        }
                    }
                }
                await Promise.all([saveHistory(), updateTitle()])
            }
        },
    })

    const messages = useThrottle(fasterMessages, 30)

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        filesState,
        onFilesLoad,
        onFileRemove,
        onSubmitWithFiles,
    } = useChatFiles(async (event, requestOptions) => {
        handleSubmit(event, requestOptions)
        if (user) {
            await chatApiClient.saveMessage({
                chatId,
                message: {
                    id: uuidv4(),
                    role: 'user',
                    content: input,
                    experimental_attachments:
                        requestOptions?.experimental_attachments,
                },
            })
            onNavigateToChatIdPage?.()
        }
    })

    const { scrollRef } = useChatScroll(messages, isLoading)

    return {
        messages,
        input,
        isLoading,
        setInput,
        stop,
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        filesState,
        onFilesLoad,
        onFileRemove,
        onSubmit: onSubmitWithFiles,
        scrollRef,
    }
}

export default useChatPage
