'use client'

import React, { useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'
import { useThrottle } from '@uidotdev/usehooks'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import MessageList from '@ui/chat/message-list.tsx'
import ChatPanel from '@ui/chat/chat-panel/chat-panel.tsx'
import useChatScroll from '@lib/client/hooks/chat/use-chat-scroll.ts'
import DragZoneOverlay from '@ui/chat/drag-zone-overlay.tsx'
import { notFound, usePathname } from 'next/navigation'
import { useAuth } from '@lib/client/hooks/use-auth.ts'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { Message } from 'ai'
import { v4 as uuidv4 } from 'uuid'

export default function Page() {
    const chatId = usePathname().split('/').filter(Boolean).pop() || ''
    const { user, loading: userLoading } = useAuth()
    const [initialMessages, setInitialMessages] = useState<Message[]>([])
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
                            toast.error('Can not update current title')
                        }
                    }
                }
                await Promise.all([saveHistory(), updateTitle()])
            }
        },
    })

    const messages = useThrottle(fasterMessages, 30)

    // load init data
    useEffect(() => {
        if (userLoading) {
            return
        }
        if (!user) {
            notFound()
        }
        if (user && chatId) {
            const fetchData = async () => {
                const data = await chatApiClient.fetchHistory(chatId)
                setInitialMessages(data?.messages ?? [])
            }
            fetchData().catch(() => {
                toast.error('unable to fetch history data')
            })
        }
    }, [setInitialMessages, chatId, user, userLoading])

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
        }
    })

    const { scrollRef } = useChatScroll(messages, isLoading)

    return (
        <>
            <main
                {...getRootProps({
                    className: 'flex-1 overflow-y-auto',
                })}
            >
                <input {...getInputProps()} />
                <DragZoneOverlay isDragActive={isDragActive} />
                {messages && messages.length > 0 && (
                    <div className="px-4">
                        <MessageList
                            messages={messages}
                            isLoading={isLoading}
                        />
                        <div ref={scrollRef} className="h-12 w-full" />
                    </div>
                )}
            </main>
            <ChatPanel
                value={input}
                isLoading={isLoading}
                filesState={filesState}
                onFilesLoad={onFilesLoad}
                onFileRemove={onFileRemove}
                open={open}
                onSubmit={onSubmitWithFiles}
                onMessageChange={setInput}
                onStop={stop}
            />
        </>
    )
}
