import { Dog } from '@public/icons'
import MarkdownBlock from '@ui/chat/markdown-block/markdown-block.tsx'
import React from 'react'
import { MessageProps } from '@ui/chat/message-item/message-item.tsx'

const AssistantItem = ({ message }: MessageProps) => {
    return (
        <div className="flex gap-4">
            <div className="size-8 self-start rounded-full bg-gray-300 p-1.5 text-black">
                <Dog className="size-full" />
            </div>
            <div className="min-w-0 flex-1">
                <MarkdownBlock markdown={message.content} />
            </div>
        </div>
    )
}

export default AssistantItem
