'use client'

import MessageList from './message-list.tsx'
import { useAssistant } from 'ai/react'
import { useChatScroll } from '@lib/client/hooks/chat/use-chat-scroll.ts'
import ChatPanel from './chat-panel/chat-panel.tsx'
import EmptyMessagePlaceholder from './empty-message-placeholder.tsx'
import useChatFiles from '@lib/client/hooks/chat/use-chat-files.ts'
import { useThrottle } from '@uidotdev/usehooks'
import { AnimatePresence, motion } from 'framer-motion'
import { Add } from '@public/icons'
import { fetchWithToken } from '@lib/client/fetch-with-token.ts'
import { toast } from 'react-toastify'
import { FormEvent } from 'react'

export type HandleSubmit = (
    event?: FormEvent<HTMLFormElement>, requestOptions?: {
        data?: Record<string, string>;
    },
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
        status,
        submitMessage,
        setInput,
        stop,
    } = useAssistant({
        api: 'api/assistant',
        fetch: fetchWithToken,
        onError: () => {
            toast.error('something went wrong, we\'re working on it')
        },
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
        onSubmitWithFiles,
    } = useChatFiles(submitMessage)

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

export default Chat
