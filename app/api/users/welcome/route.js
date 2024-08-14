// app/api/users/welcome/route.js
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';

export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, section, displayName, ...data } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const updateData = {
      [`section${section}`]: data,
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
