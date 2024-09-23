import { Book, Pen } from '@public/icons'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useMemo } from 'react'
import dateDiffUtils from '@lib/client/utils/date-diff-utils.ts'

interface ChatHistoriesProps {
    histories: {
        chatId: string
        title?: string
        updatedAt: Date
    }[]
    currentChatId?: string
    onClose: () => void
}

const useGroupedItems = (
    items: { chatId: string; title?: string; updatedAt: Date }[]
) => {
    return useMemo(() => {
        return dateDiffUtils(items)
    }, [items])
}

const GroupedItems = ({
    groupedName,
    currentChatId,
    items,
}: {
    groupedName: string
    currentChatId?: string
    items: { chatId: string; title?: string; updatedAt: Date }[]
}) => {
    if (items.length === 0) {
        return null
    }
    switch (groupedName) {
        case 'today':
            groupedName = 'Today'
            break
        case 'yesterday':
            groupedName = 'Yesterday'
            break
        case 'threeDaysAgo':
            groupedName = '3 days ago'
            break
        case 'lastWeek':
            groupedName = 'Last week'
            break
        case 'lastMonth':
            groupedName = 'Last month'
            break
        case 'threeMonthsAgo':
            groupedName = '3 months ago'
            break
        case 'lastYear':
            groupedName = 'Last year'
            break
        case 'older':
            groupedName = 'Older'
            break
    }
    return (
        <>
            <h2 className="mb-2 mt-4 px-2 py-1 text-lg text-gray-400">
                {groupedName}
            </h2>
            {items.map((item) => {
                return (
                    <HistoryItem
                        key={item.chatId}
                        currentChatId={currentChatId}
                        chatId={item.chatId}
                        title={item.title}
                    />
                )
            })}
        </>
    )
}

const HistoryItem = ({
    currentChatId,
    chatId,
    title,
}: {
    currentChatId?: string
    chatId: string
    title?: string
}) => {
    const bgColor = chatId === currentChatId ? 'bg-gray-900' : ''
    const threeDotsVisibility = chatId === currentChatId ? '!visible' : ''
    const threeDotsColor = chatId === currentChatId ? '!bg-gray-900' : ''
    return (
        <motion.li key={chatId} layout>
            <Link href={`/c/${chatId}`}>
                <div
                    className={`group relative overflow-hidden whitespace-nowrap rounded-xl p-2 text-[16px] font-normal tracking-tight hover:bg-gray-900 ${bgColor}`}
                >
                    {title || 'New Chat'}
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
}

const ChatHistories = ({
    histories,
    currentChatId,
    onClose,
}: ChatHistoriesProps) => {
    const groupedItems = useGroupedItems(histories)
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
                                {Object.entries(groupedItems).map(
                                    ([key, items]) => (
                                        <GroupedItems
                                            key={key}
                                            groupedName={key}
                                            currentChatId={currentChatId}
                                            items={items}
                                        />
                                    )
                                )}
                            </AnimatePresence>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHistories
