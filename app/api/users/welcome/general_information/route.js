import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, setDoc, updateDoc } from 'firebase/firestore';
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
    const { userId, age, gender, height, weight } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const profileDataRef = doc(collection(userRef, 'profileData'), 'profile');

    const ageValidation = ageSchema.safeParse(age);
    const genderValidation = genderSchema.safeParse(gender);

    if (!ageValidation.success || !genderValidation.success) {
      return NextResponse.json({ error: 'Invalid age or gender' }, { status: 400 });
    }

    let heightValidation, weightValidation;

    if ('cm' in height) {
      heightValidation = heightSchemaMetric.safeParse(height);
      weightValidation = weightSchemaMetric.safeParse(weight.kg);
    } else {
      heightValidation = heightSchemaImperial.safeParse(height);
      weightValidation = weightSchemaImperial.safeParse(weight.lb);
    }

    if (!heightValidation.success || !weightValidation.success) {
      return NextResponse.json({ error: 'Invalid height or weight' }, { status: 400 });
    }

    const restructuredData = {
      age: { years_old: age },
      gender,
      height,
      weight
    };

    await setDoc(profileDataRef, restructuredData, { merge: true });

    await updateDoc(userRef, {
      lastCompletedSection: 2,
      profileCompleted: false
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating general information data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
