'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { User } from 'firebase/auth'
import { auth } from '@lib/client/config/firebase-config.ts'

const AuthContext = createContext<{ user: User | null; loading: boolean }>({
    user: null,
    loading: true,
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user)
            setLoading(false)
        })

        // Cleanup subscription on unmount
        return () => unsubscribe()
    }, [])

    return (
        <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
    )

}