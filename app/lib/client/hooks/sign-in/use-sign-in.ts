import { FormEvent, useEffect, useState } from 'react'
import {
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    signInWithPopup,
} from 'firebase/auth'
import { auth } from '@lib/client/config/firebase-config.ts'
import { AuthError } from 'firebase/auth'
import { toast } from 'react-toastify'
import { useRouter } from 'next/navigation'
import { useAuth } from '@lib/client/user-provider.tsx'

export const useSignIn = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<AuthError | null>(null)
    const router = useRouter()
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        try {
            setLoading(true)
            await signInWithEmailAndPassword(auth, email, password)
        } catch (error) {
            setError(error as AuthError)
        } finally {
            setLoading(false)
        }
    }
    const handleGoogleSignIn = async () => {
        try {
            setLoading(true)
            await signInWithPopup(auth, new GoogleAuthProvider())
        } catch (error) {
            setError(error as AuthError)
        } finally {
            setLoading(false)
        }
    }
    useEffect(() => {
        if (error) {
            if (error.code == 'auth/invalid-credential') {
                toast.error('Incorrect login credentials.')
            } else {
                toast.error('Unknown Error')
            }
            setError(null)
        }
    }, [error])
    useEffect(() => {
        if (user) {
            router.push('/')
        }
    }, [user, router])
    return { loading, handleSubmit, handleGoogleSignIn }
}
