'use client'

import { Dog, GoogleSignIn } from '@public/icons'
import { Button } from '@ui/material.tsx'
import { useSignIn } from '@lib/client/hooks/sign-in/use-sign-in.ts'
import Link from 'next/link'

export default function Page() {
    const { loading, handleSubmit, handleGoogleSignIn } = useSignIn()
    return (
        <main className="flex min-h-screen items-center justify-center bg-[#171717]">
            <div className="mx-4 w-full max-w-md rounded-lg bg-gray-900 p-8 shadow-lg">
                <div className="mb-6 flex items-end justify-center gap-4">
                    <Dog className="size-12" />
                    <h2 className="text-3xl font-bold text-white">
                        Welcome Back
                    </h2>
                </div>

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
                            className="mt-1 block w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 outline-none focus:border-gray-400"
                            placeholder="••••••••"
                        />
                    </div>

                    <Button
                        type="submit"
                        color={'blue'}
                        className="w-full normal-case"
                        loading={loading}
                    >
                        Sign In
                    </Button>
                </form>

                <div className="mt-6">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                        </div>
                        <div className="text-sm relative flex justify-center">
                            <span className="bg-gray-900 px-2 text-gray-400">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <div className="mt-6">
                        <Button
                            color="brown"
                            className="flex w-full items-center justify-center bg-gray-700 normal-case"
                            onClick={handleGoogleSignIn}
                        >
                            <GoogleSignIn className="mr-2 h-5 w-5" />
                            Google
                        </Button>
                    </div>
                </div>

                <p className="text-sm mt-6 text-center text-gray-400">
                    Not a member?{' '}
                    <Link
                        href="/sign-up"
                        className="font-medium text-blue-500 hover:text-blue-400"
                    >
                        Sign up now
                    </Link>
                </p>
            </div>
        </main>
    )
}
