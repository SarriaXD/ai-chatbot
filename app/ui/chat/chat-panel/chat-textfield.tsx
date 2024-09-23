import React, { FormEvent, useEffect } from 'react'
import { ArrowUp, FileUpload, Record } from '@public/icons'
import FilesPreviewGallery from './files-preview-gallery.tsx'

interface ChatTextFieldProps {
    value: string
    isLoading: boolean
    filesState: FilesState
    onFilesLoad: (files: File[]) => void
    onFileRemove: (name: string, url: string) => void
    onOpenFile: () => void
    onMessageChange: (message: string) => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onStop: () => void
}

export interface FilesState {
    files: {
        isUploading: boolean
        url: string
        previewUrl: string
        name: string
        contentType: string
    }[]
}

const ChatTextfield = ({
    value,
    isLoading,
    filesState,
    onFilesLoad,
    onFileRemove,
    onOpenFile,
    onMessageChange,
    onSubmit,
    onStop,
}: ChatTextFieldProps) => {
    return (
        <div className="flex flex-col rounded-[28px] bg-[#2F2F2F] py-1 pl-3.5 pr-2 md:py-2 md:pl-6 md:pr-2">
            <FilesPreviewGallery
                files={filesState.files}
                onFileRemove={onFileRemove}
            />
            <InnerTextfield
                value={value}
                isLoading={isLoading}
                filesState={filesState}
                onFilesLoad={onFilesLoad}
                onFileRemove={onFileRemove}
                onOpenFile={onOpenFile}
                onMessageChange={onMessageChange}
                onSubmit={onSubmit}
                onStop={onStop}
            />
        </div>
    )
}

interface InnerTextfieldProps {
    value: string
    isLoading: boolean
    filesState: FilesState
    onFilesLoad: (files: File[]) => void
    onFileRemove: (name: string, url: string) => void
    onMessageChange: (message: string) => void
    onOpenFile: () => void
    onSubmit: (event: FormEvent<HTMLFormElement>) => void
    onStop: () => void
}

const InnerTextfield = ({
    value,
    isLoading,
    filesState,
    onFilesLoad,
    onMessageChange,
    onOpenFile,
    onSubmit,
    onStop,
}: InnerTextfieldProps) => {
    const isSomeFilesUploading = filesState.files.some(
        (file) => file.isUploading
    )
    const inputRef = React.useRef<HTMLInputElement>(null)
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [])
    return (
        <form
            className="flex items-center gap-2 md:gap-4"
            onSubmit={async (event) => {
                event.preventDefault()
                if (isSomeFilesUploading && !value) {
                    return
                }
                onSubmit(event)
            }}
            onPaste={(event) => {
                const items = event.clipboardData?.items
                if (!items || items.length === 0) {
                    return
                }
                const allowedContentTypes = [
                    'image/jpeg',
                    'image/png',
                    'image/jpg',
                    'text/*',
                ]
                const isValidFileType = (fileName: string) =>
                    allowedContentTypes.some((allowedType) => {
                        if (allowedType.endsWith('/*')) {
                            // Handle wildcard types like 'text/*'
                            const prefix = allowedType.slice(0, -1) // Remove the '*'
                            return fileName.startsWith(prefix)
                        } else {
                            // Exact match for specific types
                            return fileName === allowedType
                        }
                    })
                const files: File[] = []
                for (let i = 0; i < items.length; i++) {
                    const item = items[i]
                    if (item.kind === 'file') {
                        event.preventDefault()
                    }
                    if (isValidFileType(item.type)) {
                        const file = item.getAsFile()
                        if (file) {
                            files.push(file)
                        }
                    }
                }
                if (files.length > 0) {
                    onFilesLoad(files)
                }
            }}
        >
            <FileUploadButton onClick={onOpenFile} />
            <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onMessageChange(e.target.value)}
                className="flex-1 border-none bg-transparent p-2 text-white outline-none"
                placeholder="Type a message"
            />
            {!isLoading && (
                <button
                    type="submit"
                    className={`rounded-full p-2 text-[#2F2F2F] ${value && !isSomeFilesUploading ? 'bg-white' : 'bg-[#676767]'}`}
                    disabled={isSomeFilesUploading}
                >
                    <ArrowUp className="size-4 md:size-5" />
                </button>
            )}
            {isLoading && (
                <button
                    type={'button'}
                    onClick={onStop}
                    className="animate-pulse rounded-full bg-[#676767] p-2 text-white"
                >
                    <Record className="size-4 text-white md:size-5" />
                </button>
            )}
        </form>
    )
}

const FileUploadButton = ({ onClick }: { onClick: () => void }) => {
    return (
        <FileUpload className="size-5 text-white md:size-6" onClick={onClick} />
    )
}

export default ChatTextfield
