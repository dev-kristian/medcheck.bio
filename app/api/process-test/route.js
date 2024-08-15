// /app/api/process-test/route.js

import { NextResponse } from 'next/server';
import { verifyIdToken } from '../middleware/auth';
import { extractAndInterpretBiomarkers } from './biomarker-extraction';
import admin from 'firebase-admin';

// Initialize Firestore
const firestore = admin.firestore();

// Function to fetch user profile data
async function fetchUserProfileData(userId) {
  const userDocRef = firestore.collection('users').doc(userId);
  const profileDataRef = userDocRef.collection('profileData').doc('profile');
  const profileDoc = await profileDataRef.get();

  if (!profileDoc.exists) {
    throw new Error('Profile data not found');
  }

  return profileDoc.data();
}

export async function POST(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, images } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Fetch user profile data
    const profileData = await fetchUserProfileData(userId);

    // Extract and interpret biomarkers from the images
    const groupedResults = await extractAndInterpretBiomarkers(images, profileData);

    // Prepare the data to be saved in Firestore
    const biomarkerData = {};

    for (const [testType, reports] of Object.entries(groupedResults)) {
      biomarkerData[testType] = reports.map(report => {
        // Convert test_date to Firestore Timestamp if it's not null
        if (report.test_date) {
          const date = new Date(report.test_date);
          if (!isNaN(date.getTime())) {
            report.test_date = admin.firestore.Timestamp.fromDate(date);
          } else {
            // Set to current time if the date is invalid
            report.test_date = admin.firestore.Timestamp.fromDate(new Date());
          }
        } else {
          // Set to current time if the date is null
          report.test_date = admin.firestore.Timestamp.fromDate(new Date());
        }
        return report;
      });
    }

    // Save the results to Firestore
    const userDocRef = firestore.collection('users').doc(userId);
    const biomarkersReportRef = userDocRef.collection('biomarkers_report').doc();

    await biomarkersReportRef.set(biomarkerData);

    return NextResponse.json({ message: 'Biomarker reports processed and saved successfully' });
  } catch (error) {
    console.error('Error processing test:', error);
    return NextResponse.json({ message: 'Error processing test' }, { status: 500 });
  }
}
