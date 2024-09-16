'use client'

import 'react-toastify/dist/ReactToastify.css'
import './global.css'
import { Slide, ToastContainer } from 'react-toastify'
import { Warn } from '@public/icons'
import React from 'react'

interface ToastProviderProps {
    children: React.ReactNode
}

export default function ToastProvider({ children }: ToastProviderProps) {
    return (
        <>
            {children}
            <ToastContainer
                theme={'dark'}
                toastClassName={(context) => {
                    if (context?.type === 'success') {
                        return `${context.defaultClassName}`
                    }
                    if (context?.type === 'error') {
                        return `${context.defaultClassName} !bg-[#E96F40]`
                    }
                    if (context?.type === 'info') {
                        return `${context.defaultClassName}`
                    }
                    if (context?.type === 'warning') {
                        return `${context.defaultClassName}`
                    }
                    return 'bg-gray-500'
                }}
                position="top-center"
                autoClose={3000}
                hideProgressBar={true}
                transition={Slide}
                icon={(context) => {
                    if (context?.type === 'error') {
                        return (
                            <div className="rounded-full bg-white p-1 text-[#E96F40]">
                                <Warn className="size-3" />
                            </div>
                        )
                    }
                    return null
                }}
            />
        </>
    )
}
