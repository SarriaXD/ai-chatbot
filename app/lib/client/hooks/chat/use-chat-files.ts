import { FormEvent, useCallback, useState } from 'react'
import { FilesState } from '@ui/chat/chat-panel/chat-textfield.tsx'
import { toast } from 'react-toastify'
import { useDropzone } from 'react-dropzone'
import { chatApiClient } from '@lib/client/data/chat-api-client.ts'
import { useAuth } from '@lib/client/hooks/use-auth.ts'

export type HandleSubmit = (
    event?: FormEvent<HTMLFormElement>,
    requestOptions?: {
        experimental_attachments?: Array<{
            url: string
            name: string
            contentType: string
        }>
    }
) => void

const isImage = (file: File) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
    return allowedTypes.includes(file.type)
}

const isText = (file: File) => {
    return file.type.startsWith('text/')
}

const isPdf = (file: File) => {
    return file.type === 'application/pdf'
}

const validateFiles = (previousFilesState: FilesState, files: File[]) => {
    if (previousFilesState.files.length + files.length > 2) {
        throw new Error('You can only upload up to 2 files')
    }

    for (const file of files) {
        if (isImage(file)) {
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('Image size must be less than 5MB')
            }
        } else if (isText(file)) {
            if (file.size > 500 * 1024) {
                throw new Error('Text file size must be less than 500KB')
            }
        } else if (isPdf(file)) {
            if (file.size > 5 * 1024 * 1024) {
                throw new Error('PDF file size must be less than 5MB')
            }
        } else {
            throw new Error(
                'Currently only images and text files are supported'
            )
        }
    }
    // filter out files that are already uploaded
    const previousFile = previousFilesState.files.map((file) => file.name)
    return files.filter((file) => {
        return !previousFile.includes(file.name)
    })
}

const useChatFiles = (onSubmit: HandleSubmit) => {
    const [filesState, setFilesState] = useState<FilesState>({
        files: [],
    })
    const { user } = useAuth()

    const onFilesLoad = useCallback(
        async (acceptedFiles: File[]) => {
            if (!user) {
                toast.error('Only authenticated users can upload files')
                return
            }
            try {
                const validatedFiles = validateFiles(filesState, acceptedFiles)
                // update the preview url for images for better user experience
                setFilesState((prevState) => {
                    return {
                        files: [
                            ...prevState.files,
                            ...validatedFiles.map((file) => {
                                if (isImage(file)) {
                                    return {
                                        url: '',
                                        isUploading: true,
                                        previewUrl: URL.createObjectURL(file),
                                        name: file.name,
                                        contentType: file.type,
                                    }
                                }
                                if (isText(file) || isPdf(file)) {
                                    return {
                                        url: '',
                                        isUploading: true,
                                        previewUrl: '',
                                        name: file.name,
                                        contentType: file.type,
                                    }
                                }
                                throw new Error('Unsupported file type')
                            }),
                        ],
                    }
                })
                for (const file of validatedFiles) {
                    const url = await chatApiClient.uploadFile(file, user.uid)
                    setFilesState((previousFileState) => {
                        return {
                            files: previousFileState.files.map(
                                (previousFile) => {
                                    if (previousFile.name === file.name) {
                                        return {
                                            ...previousFile,
                                            url: url,
                                            isUploading: false,
                                        }
                                    }
                                    return previousFile
                                }
                            ),
                        }
                    })
                }
            } catch (error) {
                toast.error(`${error}`)
                // clean up the files that are not uploaded
                setFilesState((previousFileState) => {
                    return {
                        files: previousFileState.files.filter(
                            (file) => !file.isUploading && file.url !== ''
                        ),
                    }
                })
            }
        },
        [filesState, user]
    )

    const onSubmitWithFiles = useCallback(
        (event: FormEvent<HTMLFormElement>) => {
            try {
                // check if some files are still uploading
                const isSomeFilesUploading = filesState.files.some(
                    (file) => file.isUploading
                )
                if (isSomeFilesUploading) {
                    toast.error('Files are still uploading')
                    return
                }
                onSubmit(event, {
                    experimental_attachments: [...filesState.files],
                })
            } catch (e) {
                toast.error("Can' sent message right now")
            } finally {
                setFilesState(() => {
                    return {
                        files: [],
                    }
                })
            }
        },
        [filesState, onSubmit]
    )

    const onFileRemove = useCallback(async (name: string, url: string) => {
        try {
            setFilesState((prevState) => {
                return {
                    files: prevState.files.filter(
                        (image) => image.name !== name
                    ),
                }
            })
            await fetch(`/api/chat/upload?url=${url}`, {
                method: 'DELETE',
            })
        } catch (e) {
            toast.error('Error removing file from server')
        }
    }, [])

    const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
        onDrop: onFilesLoad,
        noClick: true,
    })

    return {
        filesState,
        getRootProps,
        getInputProps,
        isDragActive,
        open,
        onFilesLoad,
        onFileRemove,
        onSubmitWithFiles,
    }
}

export default useChatFiles
