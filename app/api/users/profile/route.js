import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/app/api/middleware/auth';
import admin from 'firebase-admin';

// Initialize Firestore
const firestore = admin.firestore();

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
export async function GET(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const userId = request.headers.get('X-User-ID');

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch profile data for the authenticated user
    const profileRef = firestore.collection('users').doc(userId).collection('profileData');
    const potentialConditionsDoc = await profileRef.doc('potentialConditions').get();
    const healthScoreDoc = await profileRef.doc('healthScore').get();
    const profileDoc = await profileRef.doc('profile').get();

    if (!potentialConditionsDoc.exists || !healthScoreDoc.exists || !profileDoc.exists) {
      return NextResponse.json({ error: 'Profile data not found' }, { status: 404 });
    }

    const potentialConditions = potentialConditionsDoc.data();
    const healthScore = healthScoreDoc.data();
    const profile = profileDoc.data();

    return NextResponse.json({ profileData: { potentialConditions, healthScore, profile } });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json({ message: 'Error fetching profile data' }, { status: 500 });
  }
}
