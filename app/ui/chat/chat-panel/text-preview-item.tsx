import { Close } from '@public/icons'
import React from 'react'

interface TextPreviewItemProps {
    url: string
    name: string
    isUploading: boolean
    onFileRemove: (name: string, url: string) => void
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

const TextPreviewItem = ({
    url,
    name,
    isUploading,
    onFileRemove,
}: TextPreviewItemProps) => {
    const { fileName, extension } = separateFileNameAndExtension(name)
    return (
        <div className="relative flex size-24 items-center justify-center rounded-2xl bg-white">
            <span className="px-2 text-center text-[14px] font-extrabold tracking-tighter text-blue-600">
                {fileName}
            </span>
            <span className="absolute -bottom-2 rounded bg-blue-700 px-2 text-[14px] font-extrabold tracking-tighter">
                {extension.toUpperCase()}
            </span>
            {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-gray-900 bg-opacity-50">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-4 border-l-2 border-r-2 border-t-4 border-[#676767]" />
                </div>
            )}
            <button
                onClick={() => onFileRemove(name, url)}
                type={'button'}
                className="absolute right-0 top-0 size-5 -translate-y-1 translate-x-1 rounded-full bg-[#676767] p-[5px]"
            >
                <Close className="size-full text-[#2F2F2F]" />
            </button>
        </div>
    )
}

export default TextPreviewItem
