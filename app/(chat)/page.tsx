'use client'

import { useChat } from 'ai/react'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'
import { useThrottle } from '@uidotdev/usehooks'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import MessageList from '@ui/chat/message-list.tsx'
import EmptyMessagePlaceholder from '@ui/chat/empty-message-placeholder.tsx'
import ChatPanel from '@ui/chat/chat-panel/chat-panel.tsx'
import useChatScroll from '@lib/client/hooks/chat/use-chat-scroll.ts'
import DragZoneOverlay from '@ui/chat/drag-zone-overlay.tsx'
import { useAuth } from '@lib/client/hooks/use-auth.ts'
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { useMemo } from 'react'

export default function Page() {
    const { user } = useAuth()
    const router = useRouter()
    const chatId = useMemo(() => uuidv4(), [])
    const {
        messages: fasterMessages,
        input,
        isLoading,
        handleSubmit,
        setInput,
        stop,
    } = useChat({
        id: chatId,
        fetch: fetchWithToken,
        onError: () => {
            toast.error("something went wrong, we're working on it")
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
        if (user) {
            router.push(`/c/${chatId}`)
        }
        handleSubmit(event, requestOptions)
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
                {messages && messages.length > 0 ? (
                    <div className="px-4">
                        <MessageList
                            messages={messages}
                            isLoading={isLoading}
                        />
                        <div ref={scrollRef} className="h-12 w-full" />
                    </div>
                ) : (
                    <EmptyMessagePlaceholder />
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
