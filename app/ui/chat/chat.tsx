'use client'

import MessageList from './message-list.tsx'
import { useChat } from 'ai/react'
import { useChatScroll } from '@lib/client/hooks/chat/use-chat-scroll.ts'
import ChatPanel from './chat-panel/chat-panel.tsx'
import EmptyMessagePlaceholder from './empty-message-placeholder.tsx'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import { useThrottle } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Add } from '@public/icons'
import ChatHeader from '@ui/chat/chat-header.tsx'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'

export type HandleSubmit = (
    event?: {
        preventDefault?: () => void
    },
    chatRequestOptions?: {
        experimental_attachments?: Array<{
            url: string
            name: string
            contentType: string
        }>
    }
) => void

const DragZoneOverlay = ({ isDragActive }: { isDragActive: boolean }) => {
    return (
        <AnimatePresence>
            {isDragActive && (
                <motion.div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-30 will-change-transform`}
                    initial={{
                        backdropFilter: 'blur(0px)',
                    }}
                    animate={{
                        backdropFilter: 'blur(20px)',
                    }}
                    exit={{
                        backdropFilter: 'blur(0px)',
                    }}
                >
                    <motion.div
                        initial={{
                            opacity: 0,
                        }}
                        animate={{
                            opacity: 1,
                        }}
                        exit={{
                            opacity: 0,
                        }}
                        className="flex flex-col items-center justify-center gap-16 rounded-xl text-3xl text-white"
                    >
                        <Add className="size-36 text-gray-200" />
                        Drop here to upload image
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

const Chat = () => {
    const {
        messages: fasterMessages,
        input,
        isLoading,
        handleSubmit,
        setInput,
        stop,
    } = useChat({
        fetch: fetchWithToken,
        onError: () => {
            toast.error("something went wrong, we're working on it")
        },
        keepLastMessageOnError: true,
    })

    const messages = useThrottle(fasterMessages, 16.67)

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        filesState,
        onFilesLoad,
        onFileRemove,
        onSubmitWithImages,
    } = useChatFiles(handleSubmit)

    const { scrollRef } = useChatScroll(messages, isLoading)

    return (
        <div
            {...getRootProps({
                className: 'flex size-full flex-col',
            })}
        >
            <ChatHeader />
            <input {...getInputProps()} />
            <DragZoneOverlay isDragActive={isDragActive} />
            <div className="w-full flex-1 overflow-auto">
                {messages && messages.length > 0 && (
                    <div className="px-8">
                        <MessageList
                            messages={messages}
                            isLoading={isLoading}
                        />
                        <div ref={scrollRef} className="h-12 w-full" />
                    </div>
                )}
                {(!messages || messages.length === 0) && (
                    <EmptyMessagePlaceholder />
                )}
            </div>
            <ChatPanel
                value={input}
                isLoading={isLoading}
                filesState={filesState}
                onFilesLoad={onFilesLoad}
                onFileRemove={onFileRemove}
                open={open}
                onSubmit={onSubmitWithImages}
                onMessageChange={setInput}
                onStop={stop}
            />
        </div>
    )
}

export default Chat
