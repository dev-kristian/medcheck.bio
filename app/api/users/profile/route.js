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
    const riskFactorsDoc = await profileRef.doc('riskFactors').get();
    const profileDoc = await profileRef.doc('profile').get();

    if (!riskFactorsDoc.exists || !profileDoc.exists) {
      return NextResponse.json({ error: 'Profile data not found' }, { status: 404 });
    }

    const riskFactors = riskFactorsDoc.data();
    const profile = profileDoc.data();

    return NextResponse.json({ profileData: { riskFactors, profile } });
  } catch (error) {
    console.error('Error fetching profile data:', error);
    return NextResponse.json({ message: 'Error fetching profile data' }, { status: 500 });
  }
}
