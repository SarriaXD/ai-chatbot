'use client'

import React, { useEffect } from 'react'
import { useAssistant } from 'ai/react'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'
import { useThrottle } from '@uidotdev/usehooks'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import MessageList from '@ui/chat/message-list.tsx'
import ChatPanel from '@ui/chat/chat-panel/chat-panel.tsx'
import useChatScroll from '@lib/client/hooks/chat/use-chat-scroll.ts'
import DragZoneOverlay from '@ui/chat/drag-zone-overlay.tsx'
import { notFound, usePathname } from 'next/navigation'
import useSaveChatHistoryEffect from '@lib/client/hooks/chat/use-save-chat-history-effect.ts'
import { useAuth } from '@lib/client/hooks/use-auth.ts'

export default function Page() {
    const threadId = usePathname().split('/').filter(Boolean).pop() || ''
    const { user, loading: userloading } = useAuth()
    const {
        messages: fasterMessages,
        input,
        status,
        setMessages,
        submitMessage,
        setInput,
        stop,
    } = useAssistant({
        threadId,
        api: '/api/assistant',
        fetch: fetchWithToken,
        onError: () => {
            toast.error("something went wrong, we're working on it")
        },
    })

    useEffect(() => {
        if (userloading) {
            return
        }
        if (!user) {
            notFound()
        }
        if (user && threadId) {
            const fetchData = async () => {
                const result = await fetchWithToken(
                    `/api/assistant/histories/${threadId}`
                )
                const data = await result.json()
                setMessages(data.messages ?? [])
            }
            fetchData().catch(() => {
                toast.error('unable to fetch history data')
            })
        }
    }, [setMessages, threadId, user, userloading])

    const messages = useThrottle(fasterMessages, 30)

    // Save the user's chat history
    useSaveChatHistoryEffect(user, threadId, messages, status)

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
        await submitMessage(event, requestOptions)
        setMessages((prevMessages) => {
            const beforeLastMessages = prevMessages.slice(0, -1)
            const lastMessage = prevMessages[prevMessages.length - 1]
            return [
                ...beforeLastMessages,
                {
                    ...lastMessage,
                    experimental_attachments:
                        requestOptions?.experimental_attachments,
                },
            ]
        })
    })

    const { scrollRef } = useChatScroll(messages, status === 'in_progress')

    return (
        <>
            <main
                {...getRootProps({
                    className: 'flex-1 overflow-y-auto focus:outline-none',
                })}
            >
                <input {...getInputProps()} />
                <DragZoneOverlay isDragActive={isDragActive} />
                {messages && messages.length > 0 && (
                    <div className="px-4">
                        <MessageList
                            messages={messages}
                            isLoading={status === 'in_progress'}
                        />
                        <div ref={scrollRef} className="h-12 w-full" />
                    </div>
                )}
            </main>
            <ChatPanel
                value={input}
                isLoading={status === 'in_progress'}
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
