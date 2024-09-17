import { auth } from '@lib/client/config/firebase-config.ts'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'
import useUser from '@lib/client/hooks/use-user.ts'
import { Popover, PopoverContent, PopoverHandler } from '@ui/material.tsx'
import { SignOut } from '@public/icons'

export default function ChatHeader() {
    const { user } = useUser()
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
        <div className="flex items-center justify-end px-5 py-3">
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
                                    width={40}
                                    height={40}
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
        </div>
    )
}
