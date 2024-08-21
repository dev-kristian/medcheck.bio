// app/api/users/welcome/medical_history/route.js
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

// Create a DOMPurify instance with jsdom
const window = new JSDOM('').window;
const domPurify = DOMPurify(window);

export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, allergies, medications, medicalConditions, surgeries, familyHistory } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Sanitize the input data
    const sanitizeData = (data) => {
      if (typeof data === 'string') {
        return domPurify.sanitize(data);
      } else if (typeof data === 'object' && data !== null) {
        return Object.keys(data).reduce((acc, key) => {
          acc[key] = sanitizeData(data[key]);
          return acc;
        }, {});
      }
      return data;
    };

    const sanitizedAllergies = sanitizeData(allergies);
    const sanitizedMedications = sanitizeData(medications);
    const sanitizedMedicalConditions = sanitizeData(medicalConditions);
    const sanitizedSurgeries = sanitizeData(surgeries);
    const sanitizedFamilyHistory = sanitizeData(familyHistory);

    const userRef = doc(db, 'users', userId);
    const profileDataRef = doc(collection(userRef, 'profileData'), 'profile');

    // Check if the user document exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const updateData = {
      allergies: sanitizedAllergies || false,
      medications: sanitizedMedications || false,
      medicalConditions: sanitizedMedicalConditions || false,
      surgeries: sanitizedSurgeries || false,
      familyHistory: sanitizedFamilyHistory || false
    };

    await setDoc(profileDataRef, updateData, { merge: true });

    await updateDoc(userRef, {
      lastCompletedSection: 3,
    });

    return NextResponse.json({ success: true, message: 'Medical history updated successfully' });
  } catch (error) {
    console.error('Error updating medical history data:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
