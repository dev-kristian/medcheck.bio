// /app/api/users/tests/route.js

import { NextResponse } from 'next/server';
import { verifyIdToken } from '@/app/api/middleware/auth';
import admin from 'firebase-admin';

// Initialize Firestore
const firestore = admin.firestore();

export async function GET(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const userId = request.headers.get('X-User-ID');

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch tests for the authenticated user
    const testsRef = firestore.collection('users').doc(userId).collection('biomarkers_report');
    const snapshot = await testsRef.get();

    const tests = snapshot.docs.map(doc => {
      const data = doc.data();

      // Convert Firestore timestamps to JavaScript Date objects
      Object.keys(data).forEach(key => {
        if (Array.isArray(data[key])) {
          data[key] = data[key].map(item => ({
            ...item,
            test_date: item.test_date ? item.test_date.toDate() : null,
          }));
        }
      });

      return {
        id: doc.id,
        ...data
      };
    });

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Error fetching tests:', error);
    return NextResponse.json({ message: 'Error fetching tests' }, { status: 500 });
  }
}
