import React from 'react'
import { MessageProps } from '@ui/chat/message-item/message-item.tsx'
import ZoomableImage from '@ui/zoomable-image.tsx'

const UserItem = ({ message }: MessageProps) => {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex justify-end">
                <p className="break-all rounded-[20px] bg-[#2F2F2F] px-4 py-2 !font-normal !text-[#ECECEC]">
                    {message.content}
                </p>
            </div>
            {message.experimental_attachments && (
                <div className="flex justify-end gap-4">
                    {message.experimental_attachments.map(
                        (attachment, index) => {
                            if (attachment.contentType?.startsWith('image')) {
                                return (
                                    <ImagePreview
                                        key={`${attachment.name}-${index}`}
                                        url={attachment.url}
                                        name={attachment.name}
                                    />
                                )
                            } else {
                                const { fileName, extension } =
                                    separateFileNameAndExtension(
                                        attachment.name ?? ''
                                    )
                                return (
                                    <FilePreview
                                        key={`${attachment.name}-${index}`}
                                        name={fileName}
                                        extension={extension}
                                    />
                                )
                            }
                        }
                    )}
                </div>
            )}
        </div>
    )
}

const ImagePreview = ({
    url,
    name,
}: {
    url: string
    name: string | undefined
}) => {
    return (
        <div className="relative h-80 overflow-hidden rounded-lg">
            <ZoomableImage src={url} alt={name || 'user image'} />
        </div>
    )
}

function separateFileNameAndExtension(fullFileName: string): {
    fileName: string
    extension: string
} {
    const lastDotIndex = fullFileName.lastIndexOf('.')
    if (lastDotIndex === -1) {
        return {
            fileName: fullFileName,
            extension: '',
        }
    }
    return {
        fileName: fullFileName.slice(0, lastDotIndex),
        extension: fullFileName.slice(lastDotIndex + 1),
    }
}

const FilePreview = ({
    name,
    extension,
}: {
    name: string
    extension: string
}) => {
    return (
        <div className="relative flex size-24 items-center justify-center rounded-2xl bg-white">
            <span className="overflow-hidden text-ellipsis whitespace-nowrap px-2 text-center text-[14px] font-extrabold tracking-tighter text-blue-600">
                {name}
            </span>
            <span className="absolute -bottom-2 rounded bg-blue-700 px-2 text-[14px] font-extrabold tracking-tighter">
                {extension}
            </span>
        </div>
    )
}

export default UserItem
