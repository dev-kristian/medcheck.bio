// app/api/fetch-conversations/route.js
import { verifyIdToken } from '@/app/api/middleware/auth';
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { collection, query, orderBy,getDocs } from 'firebase/firestore';

export async function GET(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid || verifiedUid !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userDocRef = collection(db, 'users', uid, 'chat_conversations');
    const q = query(userDocRef, orderBy('createdAt', 'desc')); 
    
    const querySnapshot = await getDocs(q);
    const conversations = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      messages: doc.data().messages 
    }));

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json({ error: error.message || "Failed to fetch conversations." }, { status: 500 });
  }
}