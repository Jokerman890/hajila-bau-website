import { getApps, initializeApp, applicationDefault, cert } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

const projectId = process.env.FIREBASE_PROJECT_ID
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
const storageBucket = process.env.FIREBASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET

if (!getApps().length) {
  if (projectId && clientEmail && privateKey) {
    initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      storageBucket,
    })
  } else {
    // Fallback auf Application Default Credentials (z. B. GCP)
    initializeApp({
      credential: applicationDefault(),
      storageBucket,
    })
  }
}

export const firebaseAdminBucket = storageBucket ? getStorage().bucket(storageBucket) : null
export const isFirebaseAdminConfigured = !!firebaseAdminBucket