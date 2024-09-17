import { getAuth, User } from 'firebase/auth'

async function getAuthToken(): Promise<string | null> {
    const auth = getAuth()
    const user: User | null = auth.currentUser
    return user ? user.getIdToken() : null
}

export async function fetchWithToken(
    input: RequestInfo | URL,
    init?: RequestInit
): Promise<Response> {
    const token = await getAuthToken()

    const headers = new Headers(init?.headers)
    if (token) {
        headers.set('Authorization', `Bearer ${token}`)
    }

    const newInit: RequestInit = {
        ...init,
        headers,
    }

    return fetch(input, newInit)
}
