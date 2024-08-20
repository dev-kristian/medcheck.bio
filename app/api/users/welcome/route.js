import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, updateDoc, setDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';
import * as z from 'zod';

const ageSchema = z.number().min(18, 'Age must be at least 18').max(120, 'Age must be less than 120');
const genderSchema = z.enum(['male', 'female', 'other']);

const heightSchemaMetric = z.object({
  cm: z.number().min(50, 'Height must be at least 50 cm').max(300, 'Height must be less than 300 cm')
});

const heightSchemaImperial = z.object({
  ft: z.number().min(1, 'Height must be at least 1 ft').max(9, 'Height must be less than 9 ft'),
  inch: z.number().min(0, 'Inches must be at least 0').max(11, 'Inches must be less than 12')
});

const weightSchemaMetric = z.number().min(20, 'Weight must be at least 20 kg').max(300, 'Weight must be less than 300 kg');
const weightSchemaImperial = z.number().min(44, 'Weight must be at least 44 lb').max(661, 'Weight must be less than 661 lb');

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

    if (section === 1) {
      // Introduction section logic
      const updateData = {
        lastCompletedSection: section,
        isAdult: data.isAdult,
      };

      if (displayName) {
        updateData.displayName = displayName;
      }

      await updateDoc(userRef, updateData);
    } else if (section === 2) {
      // General information section logic
      const ageValidation = ageSchema.safeParse(data.age);
      const genderValidation = genderSchema.safeParse(data.gender);

      if (!ageValidation.success || !genderValidation.success) {
        return NextResponse.json({ error: 'Invalid age or gender' }, { status: 400 });
      }

      let heightValidation, weightValidation;

      if ('cm' in data.height) {
        heightValidation = heightSchemaMetric.safeParse(data.height);
        weightValidation = weightSchemaMetric.safeParse(data.weight.kg);
      } else {
        heightValidation = heightSchemaImperial.safeParse(data.height);
        weightValidation = weightSchemaImperial.safeParse(data.weight.lb);
      }

      if (!heightValidation.success || !weightValidation.success) {
        return NextResponse.json({ error: 'Invalid height or weight' }, { status: 400 });
      }

      const restructuredData = {
        age: { years_old: data.age },
        gender: data.gender,
        height: data.height,
        weight: data.weight
      };

      await setDoc(profileDataRef, restructuredData, { merge: true });

      await updateDoc(userRef, {
        lastCompletedSection: section,
        profileCompleted: section === 3
      });
    } else if (section === 3) {
      // Medical history section logic
      const medicalHistoryData = {
        medicalHistory: data.medicalHistory,
      };

      await setDoc(profileDataRef, medicalHistoryData, { merge: true });

      await updateDoc(userRef, {
        lastCompletedSection: section,
        profileCompleted: true,
      });
    } else {
      return NextResponse.json({ error: 'Invalid section' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating welcome data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
