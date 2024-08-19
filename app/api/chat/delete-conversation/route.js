// app/api/chat/delete-conversation/route.js
import { verifyIdToken } from '@/app/api/middleware/auth';
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';

export async function DELETE(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');
    const conversationId = searchParams.get('conversationId');

    if (!uid || verifiedUid !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const conversationDocRef = doc(db, 'users', uid, 'chat_conversations', conversationId);
    await deleteDoc(conversationDocRef);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ error: error.message || "Failed to delete conversation." }, { status: 500 });
  }
}
