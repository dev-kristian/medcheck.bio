// app/api/users/welcome/route.js
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export async function PUT(request) {
  const { userId, section, ...data } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', userId);
    const updateData = {
      [`section${section}`]: data,
      lastCompletedSection: section,
    };

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
