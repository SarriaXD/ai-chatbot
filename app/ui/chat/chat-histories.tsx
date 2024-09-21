import { Close, Menu } from '@public/icons'

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
    const topItems = [
        { icon: '🌀', name: 'ChatGPT' },
        { icon: '🧠', name: 'Data Sage' },
        { icon: '📱', name: 'Flutter Expert' },
        { icon: '🚀', name: 'Flutter' },
        { icon: '🔮', name: 'NextJS Vercel AI SDK' },
        { icon: '🎨', name: 'DALL·E' },
        { icon: '🔍', name: 'Explore GPTs' },
    ]
    return (
        <div className="flex h-screen w-64 flex-col bg-[#171717] text-gray-300">
            <div className="flex items-center justify-between px-4 py-3">
                <button
                    className="size-8 rounded p-1 hover:bg-gray-800"
                    onClick={onClose}
                >
                    <Menu className="size-full transform text-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95" />
                </button>
                <button
                    className="size-8 rounded p-1.5 hover:bg-gray-800"
                    onClick={onClose}
                >
                    <Close className="size-full transform text-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95" />
                </button>
            </div>
            <div className={'flex-1 overflow-scroll'}>
                <ul className="space-y-2 p-4">
                    {topItems.map((item, index) => (
                        <li
                            key={index}
                            className="flex cursor-pointer items-center space-x-3 rounded p-2 hover:bg-gray-800"
                        >
                            <span className="text-xl font-normal">
                                {item.icon}
                            </span>
                            <span>{item.name}</span>
                        </li>
                    ))}
                </ul>

                <div className="p-4">
                    {['Today', 'Yesterday', 'Previous 7 Days'].map(
                        (category) => (
                            <div key={category} className="mb-4">
                                <h3 className="text-sm p-2 font-semibold text-gray-500">
                                    {category}
                                </h3>
                                <ul className="space-y-1">
                                    {histories.map((item, index) => {
                                        const bgColor =
                                            item.chatId === currentChatId
                                                ? 'bg-gray-800'
                                                : ''
                                        return (
                                            <li
                                                key={index}
                                                className={`cursor-pointer rounded p-2 text-[14px] font-normal hover:bg-gray-800 ${bgColor}`}
                                            >
                                                {item.title ?? 'New Chat'}
                                            </li>
                                        )
                                    })}
                                </ul>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    )
}

export default ChatHistories
