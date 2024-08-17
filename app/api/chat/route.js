import OpenAI from "openai";
import { verifyIdToken } from '@/app/api/middleware/auth';
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, updateDoc, arrayUnion, getDocs, query, where, addDoc, getDoc } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY,
});

export async function POST(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { uid, message, conversationId } = await request.json();

    if (!uid || verifiedUid !== uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userDocRef = doc(db, 'users', uid);
    const chatCollectionRef = collection(userDocRef, 'chat_conversations');

    let chatDocRef;
    let previousMessages = [];

    if (conversationId) {
      chatDocRef = doc(chatCollectionRef, conversationId);
      const chatDoc = await getDoc(chatDocRef);
      if (chatDoc.exists()) {
        previousMessages = chatDoc.data().messages || [];
      }
    } else {
      // Create a new conversation document with Unix timestamp
      chatDocRef = await addDoc(chatCollectionRef, {
        messages: [],
        active: true,
        createdAt: Math.floor(Date.now() / 1000) // Unix timestamp in seconds
      });
    }

    // Prepare messages for OpenAI API
    const apiMessages = [
      { role: "system", content: "You are a helpful assistant." },
      ...previousMessages,
      { role: "user", content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
    });

    const aiResponse = completion.choices[0].message.content;

    // Update Firestore with new messages
    await updateDoc(chatDocRef, {
      messages: arrayUnion(
        { role: 'user', content: message },
        { role: 'assistant', content: aiResponse }
      )
    });

    return NextResponse.json({ 
      content: aiResponse, 
      conversationId: chatDocRef.id 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || "Failed to fetch AI response." }, { status: 500 });
  }
}