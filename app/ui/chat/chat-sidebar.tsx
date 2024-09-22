import React, { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ChatHistories from '@ui/chat/chat-histories.tsx'
import { usePathname } from 'next/navigation'
import { useAuth } from '@lib/client/hooks/use-auth.ts'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { toast } from 'react-toastify'

interface ChatSidebarProps {
    open: boolean
    onClose: () => void
}

const useChatHistories = () => {
    const path = usePathname()
    const match = path.match(/c\/(.+)$/)
    const currentChatId = match ? match[1] : undefined
    const [histories, setHistories] = React.useState<
        {
            chatId: string
            title?: string
            updatedAt: Date
        }[]
    >([])
    const { user } = useAuth()
    useEffect(() => {
        let unsubscribe = () => {}
        if (user) {
            unsubscribe = chatApiClient.listenHistories(
                user.uid,
                20,
                (histories) => {
                    setHistories(histories)
                },
                () => {
                    toast.error('Failed to fetch chat histories')
                }
            )
        }
        return unsubscribe
    }, [user])
    return { histories, currentChatId }
}

const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
    const { histories, currentChatId } = useChatHistories()
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{
                        backdropFilter: 'blur(0px)',
                    }}
                    animate={{
                        backdropFilter: 'blur(5px)',
                    }}
                    exit={{
                        backdropFilter: 'blur(0px)',
                    }}
                    onClick={onClose}
                    className="fixed inset-x-0 top-0 z-50 size-full bg-transparent will-change-transform md:static md:w-auto md:backdrop-blur-none"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        exit={{ width: 0 }}
                        transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
                    >
                        <motion.div
                            initial={{
                                x: '-276px',
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: '-276px',
                            }}
                            transition={{
                                ease: [0.76, 0, 0.24, 1],
                                duration: 0.6,
                            }}
                        >
                            <ChatHistories
                                histories={histories}
                                currentChatId={currentChatId}
                                onClose={onClose}
                            />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ChatSidebar
