import '@lib/service/config/firebase-admin-config'
import { auth } from 'firebase-admin'
import { DecodedIdToken } from 'firebase-admin/auth'

async function validateFirebaseToken(
    token: string
): Promise<DecodedIdToken | null> {
    try {
        return await auth().verifyIdToken(token)
    } catch (error) {
        console.error('Error validating Firebase token:', error)
        return null
    }
}

function extractTokenFromHeader(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }
    return authHeader.split('Bearer ')[1]
}

export async function validateAndDecodeToken(
    request: Request
): Promise<DecodedIdToken | null> {
    const authHeader = request.headers.get('authorization')
    const token = extractTokenFromHeader(authHeader)
    if (!token) {
        return null
    }
    return await validateFirebaseToken(token)
}
