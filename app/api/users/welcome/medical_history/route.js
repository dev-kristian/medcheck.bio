import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, setDoc, updateDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, medicalHistory } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const profileDataRef = doc(collection(userRef, 'profileData'), 'profile');

    const medicalHistoryData = {
      medicalHistory,
    };

    await setDoc(profileDataRef, medicalHistoryData, { merge: true });

    await updateDoc(userRef, {
      lastCompletedSection: 3,
      profileCompleted: true,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating medical history data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}