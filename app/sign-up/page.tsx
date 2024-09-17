'use client'

import React from 'react'
import { Button } from '@ui/material.tsx'
import { useSignUp } from '@lib/client/hooks/sign-up/use-sign-up.ts'

export default function Page() {
    const { loading, validationError, handleSubmit } = useSignUp()
    return (
        <div className="flex min-h-screen items-center justify-center bg-[#171717]">
            <div className="mx-4 w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-lg">
                <h2 className="mb-6 text-2xl font-bold text-white">Sign Up</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="text-sm block font-medium text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            name="email"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-gray-400"
                            placeholder="your@email.com"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="text-sm block font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-gray-400"
                            placeholder="••••••••"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="confirm-password"
                            className="text-sm block font-medium text-gray-300"
                        >
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            name="confirm-password"
                            required
                            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-gray-400"
                            placeholder="••••••••"
                        />
                    </div>
                    {validationError && (
                        <p className="text-sm text-red-500">
                            {validationError}
                        </p>
                    )}
                    <Button
                        type="submit"
                        color={'blue'}
                        loading={loading}
                        className="w-full"
                    >
                        Sign Up
                    </Button>
                </form>
            </div>
        </div>
    )
}
