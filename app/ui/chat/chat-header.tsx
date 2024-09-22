import { auth } from '@lib/client/config/firebase-config.ts'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import { Popover, PopoverContent, PopoverHandler } from '@ui/material.tsx'
import { Book, Pen, SignOut } from '@public/icons'
import { useAuth } from '@lib/client/hooks/use-auth.ts'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ChatHeader({
    isSidebarOpen,
    loading,
    onClickSidebar,
}: {
    isSidebarOpen: boolean
    loading: boolean
    onClickSidebar: (open: boolean) => void
}) {
    const { user } = useAuth()
    const router = useRouter()
    const handleSignIn = () => {
        router.push('/sign-in')
    }
    const handleSignOut = async () => {
        try {
            await signOut(auth)
        } catch (error) {
            console.error(error)
        }
    }
    const handleSignUp = () => {
        router.push('/sign-up')
    }
    return (
        <div className="flex h-16 items-center justify-between px-4 py-3">
            {!loading && (
                <>
                    {!isSidebarOpen && (
                        <motion.div
                            className={'flex items-center justify-center gap-4'}
                            initial={{
                                opacity: 0,
                                x: '-100%',
                            }}
                            animate={{
                                opacity: 1,
                                x: 0,
                                transition: {
                                    duration: 0.3,
                                    delay: 0.3,
                                },
                            }}
                        >
                            {user && (
                                <button
                                    className="rounded-lg p-2 hover:bg-gray-800"
                                    onClick={() =>
                                        onClickSidebar(!isSidebarOpen)
                                    }
                                >
                                    <Book className="size-full transform text-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95" />
                                </button>
                            )}
                            <button className="rounded-lg p-2 hover:bg-gray-800">
                                <Link href={'/'}>
                                    <Pen className="size-full transform text-gray-400 transition-all duration-200 hover:shadow-lg active:scale-95" />
                                </Link>
                            </button>
                        </motion.div>
                    )}
                    <div className={'flex gap-2'}></div>
                    {!user && (
                        <div className={'flex gap-2'}>
                            <button
                                onClick={handleSignIn}
                                className="rounded-full bg-white px-3 py-1 text-[14px] font-semibold text-gray-800 transition duration-300 hover:bg-gray-200"
                            >
                                Sign in
                            </button>
                            <button
                                onClick={handleSignUp}
                                className="hidden rounded-full border border-gray-800 px-3 py-1 text-[14px] font-semibold text-white transition duration-300 hover:border-gray-600 hover:bg-gray-800 md:block"
                            >
                                Create account
                            </button>
                        </div>
                    )}
                    {user && (
                        <Popover placement={'bottom-start'}>
                            <PopoverHandler>
                                <button
                                    className={
                                        'overflow-hidden rounded-full border border-gray-400 bg-[#7988FF]'
                                    }
                                >
                                    {user.photoURL ? (
                                        <img
                                            src={user.photoURL}
                                            alt={
                                                user.displayName ??
                                                "User's profile picture"
                                            }
                                            width={32}
                                            height={32}
                                        />
                                    ) : (
                                        user.displayName ?? 'You'
                                    )}
                                </button>
                            </PopoverHandler>
                            <PopoverContent
                                className={
                                    'w-64 overflow-hidden rounded-xl border-[0.5px] border-gray-800 bg-[#2F2F2F] p-2 shadow-none'
                                }
                            >
                                <button
                                    onClick={handleSignOut}
                                    className="flex w-full items-center gap-2 rounded-lg p-4 text-[14px] font-semibold text-white hover:bg-gray-800"
                                >
                                    <SignOut className={'size-4'} />
                                    Sign out
                                </button>
                            </PopoverContent>
                        </Popover>
                    )}
                </>
            )}
        </div>
    )
}
