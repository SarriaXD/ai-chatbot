'use client'

import React, { useEffect, useState } from 'react'
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

export default function Page() {
    const chatId = usePathname().split('/').filter(Boolean).pop() || ''
    const { user, loading: userLoading } = useAuth()
    const [initialMessages, setInitialMessages] = useState<Message[]>([])
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
        onFinish: () => {
            if (user) {
                chatApiClient
                    .saveHistories({
                        chatId,
                        messages,
                    })
                    .catch(() => {
                        toast.error("something went wrong, we're working on it")
                    })
            }
        },
    })

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
            fetchData().catch((error) => {
                console.log(error)
                toast.error('unable to fetch history data')
            })
        }
    }, [setInitialMessages, chatId, user, userLoading])

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
    } = useChatFiles(handleSubmit)

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
