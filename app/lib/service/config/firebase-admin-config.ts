import * as admin from 'firebase-admin'

if (!admin.apps.length) {
    try {
        const base64ServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
        if (!base64ServiceAccount) {
            throw new Error(
                'FIREBASE_SERVICE_ACCOUNT_BASE64 is not set in the environment variables'
            )
        }
        const serviceAccount = JSON.parse(
            Buffer.from(base64ServiceAccount, 'base64').toString()
        )
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
        })
        console.log('Firebase Admin initialized')
    } catch (error) {
        console.error('Firebase admin initialization error', error)
    }
}

export { admin }
