import { motion } from 'framer-motion'
import React from 'react'
import ImagePreviewItem from './image-preview-item.tsx'
import TextPreviewItem from '@ui/chat/chat-panel/text-preview-item.tsx'

interface FilesPreviewProps {
    files: {
        isUploading: boolean
        url: string
        previewUrl: string
        name: string
        contentType: string
    }[]
    onFileRemove: (name: string, url: string) => void
}

const FilesPreviewGallery = ({ files, onFileRemove }: FilesPreviewProps) => {
    const hasFiles = files.length > 0
    return (
        <motion.div
            animate={{
                height: hasFiles ? 'auto' : 0,
                margin: hasFiles ? '12px' : '0',
            }}
        >
            <div className="flex gap-4">
                {files.map((file) => {
                    if (file.contentType.startsWith('image')) {
                        return (
                            <ImagePreviewItem
                                key={file.name}
                                {...file}
                                onImageRemove={onFileRemove}
                            />
                        )
                    } else {
                        return (
                            <TextPreviewItem
                                key={file.name}
                                {...file}
                                onFileRemove={onFileRemove}
                            />
                        )
                    }
                })}
            </div>
        </motion.div>
    )
}

export default FilesPreviewGallery
