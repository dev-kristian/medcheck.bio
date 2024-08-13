// app/api/middleware/auth.js
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      clientEmail: process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    }),
  });
}

export async function verifyIdToken(request) {
  const idToken = request.headers.get('Authorization')?.split('Bearer ')[1];
  if (!idToken) {
    throw new Error('Authorization token is required');
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Unauthorized');
  }
}
