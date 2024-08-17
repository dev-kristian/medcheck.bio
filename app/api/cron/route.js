// app/api/cron/route.js

import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { extractAndInterpretBiomarkers } from '../process-test/biomarker-extraction';
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

async function processTask(task) {
  const { userId, images, additionalInfo } = task;

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

  return { id: biomarkersReportRef.id, ...frontendData };
}

export async function GET(request) {
  const authHeader = request.headers.get('Authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const taskString = await redis.rpop('test-processing-queue');
    if (!taskString) {
      return NextResponse.json({ message: 'No tasks in the queue' });
    }

    const task = JSON.parse(taskString);
    const result = await processTask(task);

    return NextResponse.json({ message: 'Task processed successfully', data: result });
  } catch (error) {
    console.error('Error processing task:', error);
    return NextResponse.json({ message: 'Error processing task' }, { status: 500 });
  }
}
 