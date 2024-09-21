'use client'

import { useAssistant } from 'ai/react'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'
import { useThrottle } from '@uidotdev/usehooks'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import MessageList from '@ui/chat/message-list.tsx'
import EmptyMessagePlaceholder from '@ui/chat/empty-message-placeholder.tsx'
import ChatPanel from '@ui/chat/chat-panel/chat-panel.tsx'
import useChatScroll from '@lib/client/hooks/chat/use-chat-scroll.ts'
import DragZoneOverlay from '@ui/chat/drag-zone-overlay.tsx'
import { useAuth } from '@lib/client/user-provider.tsx'
import { useEffect } from 'react'
import useSaveChatHistoryEffect from '@lib/client/hooks/chat/use-save-chat-history-effect.ts'

export default function Page() {
    const { user } = useAuth()
    const {
        threadId,
        messages: fasterMessages,
        input,
        status,
        setMessages,
        submitMessage,
        setInput,
        stop,
    } = useAssistant({
        api: '/api/assistant',
        fetch: fetchWithToken,
        onError: () => {
            toast.error("something went wrong, we're working on it")
        },
    })

    const messages = useThrottle(fasterMessages, 30)

    // save the user's chat history
    useSaveChatHistoryEffect(user, threadId, messages, status)

    // Reload the page when the user navigates back to the chat
    useEffect(() => {
        const handlePopState = () => {
            window.location.reload()
        }
        window.addEventListener('popstate', handlePopState)

        return () => {
            window.removeEventListener('popstate', handlePopState)
        }
    }, [])

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

    useEffect(() => {
        if (user && threadId) {
            window.history.pushState({}, '', `c/${threadId}`)
        }
    }, [threadId, user])

    const { scrollRef } = useChatScroll(messages, status === 'in_progress')

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
                            isLoading={status === 'in_progress'}
                        />
                        <div ref={scrollRef} className="h-12 w-full" />
                    </div>
                ) : (
                    <EmptyMessagePlaceholder />
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
