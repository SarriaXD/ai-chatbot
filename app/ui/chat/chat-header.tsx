import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '@lib/config/firebase-config.ts'
import { Button } from '@ui/material.tsx'
import { useRouter } from 'next/navigation'
import { signOut } from 'firebase/auth'

export default function ChatHeader() {
    const [user] = useAuthState(auth)
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
    return (
        <div className="flex items-center justify-end">
            {user && (
                <Button
                    variant="text"
                    className="normal-case text-white"
                    onClick={handleSignOut}
                >
                    Sign Out
                </Button>
            )}
            {!user && (
                <Button
                    variant="text"
                    className="normal-case text-white"
                    onClick={handleSignIn}
                >
                    Sign In
                </Button>
            )}
        </div>
    )
}
