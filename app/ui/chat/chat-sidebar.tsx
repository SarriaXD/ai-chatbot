import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ChatHistories from '@ui/chat/chat-histories.tsx'

interface ChatSidebarProps {
    open: boolean
    onClose: () => void
}

const ChatSidebar = ({ open, onClose }: ChatSidebarProps) => {
    return (
        <AnimatePresence mode="wait">
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
                    className="fixed left-0 top-0 z-50 h-screen w-full bg-transparent will-change-transform md:static md:w-auto md:backdrop-blur-none"
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        exit={{ width: 0 }}
                        transition={{ ease: [0.76, 0, 0.24, 1], duration: 0.6 }}
                    >
                        <motion.div
                            initial={{
                                x: '-256px',
                            }}
                            animate={{
                                x: 0,
                            }}
                            exit={{
                                x: '-256px',
                            }}
                            transition={{
                                ease: [0.76, 0, 0.24, 1],
                                duration: 0.6,
                            }}
                        >
                            <ChatHistories onClose={onClose} />
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

export default ChatSidebar
