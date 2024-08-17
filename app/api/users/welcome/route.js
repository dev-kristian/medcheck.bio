import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, updateDoc, setDoc, getDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, section, displayName, ...data } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const profileDataRef = doc(collection(userRef, 'profileData'), 'profile');

    // Update the profileData document with the new data
    await setDoc(profileDataRef, data, { merge: true });

    // Update the user document with the last completed section and displayName if provided
    const updateData = {
      lastCompletedSection: section,
    };

    if (displayName) {
      updateData.displayName = displayName;
    }

    if (section === 3) {
      updateData.profileCompleted = true;
    }

    await updateDoc(userRef, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating welcome data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
