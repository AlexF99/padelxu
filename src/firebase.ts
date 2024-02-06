import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyARqsp2QE0pRJfJneL4vg3xWAWYWKmrxs0",
    authDomain: "xupadel-3bb3e.firebaseapp.com",
    projectId: "xupadel-3bb3e",
    storageBucket: "xupadel-3bb3e.appspot.com",
    messagingSenderId: "848524545834",
    appId: "1:848524545834:web:509c3423e8ceaed2bc5853"
};

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export default app
