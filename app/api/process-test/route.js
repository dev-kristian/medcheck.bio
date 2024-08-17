import { NextResponse } from 'next/server';
import { verifyIdToken } from '../middleware/auth';
import { extractAndInterpretBiomarkers } from './biomarker-extraction';
import admin from 'firebase-admin';

const firestore = admin.firestore();

async function fetchUserProfileData(userId) {
  const userDocRef = firestore.collection('users').doc(userId);
  const profileDataRef = userDocRef.collection('profileData').doc('profile');
  const profileDoc = await profileDataRef.get();

  if (!profileDoc.exists) {
    throw new Error('Profile data not found');
  }

  return profileDoc.data();
}
export const maxDuration = 60; 
export const dynamic = 'force-dynamic';
export async function POST(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, images } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const profileData = await fetchUserProfileData(userId);
    const groupedResults = await extractAndInterpretBiomarkers(images, profileData);

    const biomarkerData = {};
    const frontendData = {};

    for (const [testType, reports] of Object.entries(groupedResults)) {
      biomarkerData[testType] = reports.map(report => ({
        ...report,
        test_date: report.test_date ? admin.firestore.Timestamp.fromDate(new Date(report.test_date)) : admin.firestore.Timestamp.fromDate(new Date())
      }));

      frontendData[testType] = reports.map(report => ({
        ...report,
        test_date: report.test_date ? new Date(report.test_date).toISOString() : new Date().toISOString()
      }));
    }

    const userDocRef = firestore.collection('users').doc(userId);
    const biomarkersReportRef = userDocRef.collection('biomarkers_report').doc();

    await biomarkersReportRef.set(biomarkerData);

    return NextResponse.json({ 
      message: 'Biomarker reports processed and saved successfully', 
      data: { id: biomarkersReportRef.id, ...frontendData } 
    });
  } catch (error) {
    console.error('Error processing test:', error);
    return NextResponse.json({ message: 'Error processing test' }, { status: 500 });
  }
}
