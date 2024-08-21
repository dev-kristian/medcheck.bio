import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, displayName, isAdult } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const updateData = {
      lastCompletedSection: 1,
      isAdult,
    };

    if (displayName) {
      updateData.displayName = displayName;
    }

    await updateDoc(userRef, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating introduction data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
