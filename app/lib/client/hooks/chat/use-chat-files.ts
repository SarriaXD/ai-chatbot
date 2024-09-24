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

const validateFiles = (previousFilesState: FilesState, files: File[]) => {
    if (previousFilesState.files.length + files.length > 2) {
        throw new Error('You can only upload up to 2 files')
    }

    // check if the file type is valid, currently only images and text are allowed
    const allowedContentTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'text/*',
    ]
    const isValidFileType = (file: File) =>
        allowedContentTypes.some((allowedType) => {
            if (allowedType.endsWith('/*')) {
                // Handle wildcard types like 'text/*'
                const prefix = allowedType.slice(0, -1) // Remove the '*'
                return file.type.startsWith(prefix)
            } else {
                // Exact match for specific types
                return file.type === allowedType
            }
        })
    if (files.some((file) => !isValidFileType(file))) {
        throw new Error('only images and text files are allowed')
    }
    // filter out files that are already uploaded
    const previousFile = previousFilesState.files.map((file) => file.name)
    const filteredFiles = files.filter((file) => {
        return !previousFile.includes(file.name)
    })
    // check if the total size of files is less than 5MB
    if (filteredFiles.some((file) => file.size > 5 * 1024 * 1024)) {
        throw new Error('File size should be less than 5MB')
    }
    return filteredFiles
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
                                if (file.type.startsWith('image/')) {
                                    return {
                                        url: '',
                                        isUploading: true,
                                        previewUrl: URL.createObjectURL(file),
                                        name: file.name,
                                        contentType: file.type,
                                    }
                                }
                                return {
                                    url: '',
                                    isUploading: true,
                                    previewUrl: '',
                                    name: file.name,
                                    contentType: file.type,
                                }
                            }),
                        ],
                    }
                })
                for (const file of validatedFiles) {
                    const url = await chatApiClient.uploadFile(file, user.uid)
                    setFilesState((before) => {
                        return {
                            files: before.files.map((prevState) => {
                                if (prevState.name === file.name) {
                                    return {
                                        ...prevState,
                                        url: url,
                                        isUploading: false,
                                    }
                                }
                                return prevState
                            }),
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
