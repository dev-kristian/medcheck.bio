// app/api/users/medical-details/route.js

import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

export async function PUT(request) {
  const { userId, age, gender, medicalHistory } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      age,
      gender,
      medicalHistory,
      profileCompleted: true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating medical details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}