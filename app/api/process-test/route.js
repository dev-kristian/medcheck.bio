// app/api/process-test/route.js

import { NextResponse } from 'next/server';
import { verifyIdToken } from '../middleware/auth';
import redis from '@/lib/redis';

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, images, additionalInfo } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const task = {
      userId,
      images,
      additionalInfo,
      timestamp: new Date().toISOString(),
    };

    await redis.lpush('test-processing-queue', JSON.stringify(task));

    return NextResponse.json({ message: 'Test processing task added to the queue' });
  } catch (error) {
    console.error('Error adding task to queue:', error);
    return NextResponse.json({ message: 'Error adding task to queue' }, { status: 500 });
  }
}
