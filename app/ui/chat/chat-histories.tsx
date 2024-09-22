import { Book, Pen } from '@public/icons'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'

interface ChatHistoriesProps {
    histories: {
        chatId: string
        title?: string
        updatedAt: Date
    }[]
    currentChatId?: string
    onClose: () => void
}

const ChatHistories = ({
    histories,
    currentChatId,
    onClose,
}: ChatHistoriesProps) => {
    return (
        <div className="flex h-full w-[256px] flex-col bg-[#171717] text-gray-300">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    className="rounded-lg p-2 hover:bg-gray-900"
                    onClick={onClose}
                >
                    <Book className="transform text-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95" />
                </button>
                <button className="rounded-lg p-2 hover:bg-gray-900">
                    <Link href={'/'}>
                        <Pen className="size-full transform text-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95" />
                    </Link>
                </button>
            </div>
            <div className={'flex-1 overflow-scroll'}>
                <div className="p-2">
                    <div className="mb-4">
                        <ul>
                            <AnimatePresence initial={false}>
                                {histories.map((item) => {
                                    const bgColor =
                                        item.chatId === currentChatId
                                            ? 'bg-gray-900'
                                            : ''
                                    const threeDotsVisibility =
                                        item.chatId === currentChatId
                                            ? '!visible'
                                            : ''
                                    const threeDotsColor =
                                        item.chatId === currentChatId
                                            ? '!bg-gray-900'
                                            : ''
                                    return (
                                        <motion.li key={item.chatId} layout>
                                            <Link href={`/c/${item.chatId}`}>
                                                <div
                                                    className={`group relative overflow-hidden whitespace-nowrap rounded-xl p-2 text-[16px] font-normal tracking-tight hover:bg-gray-900 ${bgColor}`}
                                                >
                                                    {item.title || 'New Chat'}
                                                    <div
                                                        className={`absolute inset-y-0 right-0 flex items-center justify-center bg-[#171717] group-hover:bg-gray-900 ${threeDotsColor}`}
                                                        style={{
                                                            maskImage:
                                                                'linear-gradient(to left, black 60%, transparent)',
                                                        }}
                                                    >
                                                        <span
                                                            className={`invisible flex h-full items-center justify-center gap-0.5 pl-6 pr-2 group-hover:visible ${threeDotsVisibility}`}
                                                        >
                                                            <span className="size-1 rounded-full bg-gray-400" />
                                                            <span className="size-1 rounded-full bg-gray-400" />
                                                            <span className="size-1 rounded-full bg-gray-400" />
                                                        </span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </motion.li>
                                    )
                                })}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHistories
