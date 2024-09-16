import { FormEvent, useEffect, useState } from 'react'
import { AuthError, createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { auth } from '@lib/config/firebase-config.ts'

export const useSignUp = () => {
    const [validationError, setValidationError] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<AuthError | null>(null)
    const router = useRouter()

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirm-password') as string
        if (password !== confirmPassword) {
            setValidationError('Passwords do not match')
            return
        }
        try {
            setLoading(true)
            await createUserWithEmailAndPassword(auth, email, password)
            router.push('/')
        } catch (error) {
            setError(error as AuthError)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (error) {
            if (error.code == 'auth/email-already-in-use') {
                toast.error('Email already exists.')
            } else {
                toast.error('Unknown Error')
            }
            console.log(error.code)
            setError(null)
        }
    }, [error])
    return {
        loading,
        validationError,
        handleSubmit,
    }
}
