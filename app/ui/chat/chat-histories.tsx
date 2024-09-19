import { Close, Menu } from '@public/icons'
import React from 'react'

const ChatHistories = ({ onClose }: { onClose: () => void }) => {
    const topItems = [
        { icon: '🌀', name: 'ChatGPT' },
        { icon: '🧠', name: 'Data Sage' },
        { icon: '📱', name: 'Flutter Expert' },
        { icon: '🚀', name: 'Flutter' },
        { icon: '🔮', name: 'NextJS Vercel AI SDK' },
        { icon: '🎨', name: 'DALL·E' },
        { icon: '🔍', name: 'Explore GPTs' },
    ]

    const recentItems = [
        { name: '今夕年份查询', category: 'Today' },
        { name: '获取Firebase头像URL', category: 'Yesterday' },
        { name: 'KNN Exam Review', category: 'Previous 7 Days' },
        { name: 'KNN算法介绍', category: 'Previous 7 Days' },
        { name: '台湾冲突防阻法案', category: 'Previous 7 Days' },
        { name: '工签配偶陪同情况', category: 'Previous 7 Days' },
        { name: '使用 React Suspense', category: 'Previous 7 Days' },
        { name: 'React Suspense Overview', category: 'Previous 7 Days' },
        { name: '问候与帮助', category: 'Previous 7 Days' },
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
                                    {recentItems
                                        .filter(
                                            (item) => item.category === category
                                        )
                                        .map((item, index) => (
                                            <li
                                                key={index}
                                                className="cursor-pointer rounded p-2 text-[14px] font-normal hover:bg-gray-800"
                                            >
                                                {item.name}
                                            </li>
                                        ))}
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
