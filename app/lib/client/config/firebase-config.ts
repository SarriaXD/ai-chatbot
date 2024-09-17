import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDXV0-C_xP0cphQxYZzR6b9ivCvgMfPkds',
    authDomain: 'sarria-chat-app.firebaseapp.com',
    projectId: 'sarria-chat-app',
    storageBucket: 'sarria-chat-app.appspot.com',
    messagingSenderId: '29210880374',
    appId: '1:29210880374:web:ae307f69b1f903e8673257',
}

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp()

export const auth = getAuth(app)
