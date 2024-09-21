import { useContext } from 'react'
import { AuthContext } from '@lib/client/auth-provider.tsx'

export const useAuth = () => useContext(AuthContext)
