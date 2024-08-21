import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

// Create a DOMPurify instance with jsdom
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, dailySleepPattern, dietaryHabits, physicalActivity, smokingHabits, alcoholConsumption } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const profileDataRef = doc(collection(userRef, 'profileData'), 'profile');

    // Check if the user document exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sanitize the custom input for dietary habits
    const sanitizedDietaryHabits = purify.sanitize(dietaryHabits);

    const updateData = {
      dailySleepPattern: dailySleepPattern || 'Not specified',
      dietaryHabits: sanitizedDietaryHabits || 'Not specified',
      physicalActivity: physicalActivity || 'Not specified',
      smokingHabits: smokingHabits || 'Not specified',
      alcoholConsumption: alcoholConsumption || 'Not specified'
    };

    await setDoc(profileDataRef, updateData, { merge: true });

    await updateDoc(userRef, {
      lastCompletedSection: 4,
      profileCompleted: true,
    });

    return NextResponse.json({ success: true, message: 'Lifestyle information updated successfully' });
  } catch (error) {
    console.error('Error updating lifestyle data:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
