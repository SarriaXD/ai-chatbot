import { Close, Menu } from '@public/icons'
import Link from 'next/link'

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
        <div className="flex h-screen w-[276px] flex-col bg-[#171717] text-gray-300">
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
                    {/*<li*/}
                    {/*    className="flex cursor-pointer items-center space-x-3 rounded p-2 hover:bg-gray-800"*/}
                    {/*>*/}
                    {/*    <span className="text-xl font-normal">*/}
                    {/*    */}
                    {/*    </span>*/}
                    {/*    <span>*/}
                    {/*        */}
                    {/*    </span>*/}
                    {/*</li>*/}
                </ul>

                <div className="p-2">
                    <div className="mb-4">
                        <ul>
                            {histories.map((item, index) => {
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
                                    <li key={index}>
                                        <Link
                                            href={`/c/${item.chatId}`}
                                            className=""
                                        >
                                            <div
                                                className={`group relative overflow-hidden whitespace-nowrap rounded-xl p-2 text-[16px] font-normal tracking-tight hover:bg-gray-900 ${bgColor}`}
                                            >
                                                {item.title ?? 'New Chat'}
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
                                    </li>
                                )
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatHistories
