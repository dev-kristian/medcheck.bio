// app/api/users/route.js

import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function POST(request) {
  const { uid, email, displayName } = await request.json();

  if (!uid) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const createdAt = new Date();
      await setDoc(userRef, {
        email,
        displayName,
        createdAt,
        profileCompleted: false
      });
      return NextResponse.json({ profileCompleted: false });
    } else {
      const userData = userSnap.data();
      return NextResponse.json({ profileCompleted: userData.profileCompleted || false });
    }
  } catch (error) {
    console.error('Error checking or creating user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      const userData = userSnap.data();
      return NextResponse.json({ profileCompleted: userData.profileCompleted || false });
    } else {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}