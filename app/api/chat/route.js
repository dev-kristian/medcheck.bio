import OpenAI from "openai";
import { verifyIdToken } from '@/app/api/middleware/auth';
import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, updateDoc, getDocs, addDoc, getDoc } from 'firebase/firestore';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY,
});

async function fetchUserProfileData(uid) {
  const userProfileRef = doc(db, 'users', uid, 'profileData', 'profile');
  const userProfileSnap = await getDoc(userProfileRef);
  
  if (userProfileSnap.exists()) {
    return userProfileSnap.data();
  } else {
    return null;
  }
}

async function fetchBiomarkersReports(uid) {
  const biomarkersReportsRef = collection(db, 'users', uid, 'biomarkers_report');
  const biomarkersReportsSnap = await getDocs(biomarkersReportsRef);
  
  const reports = [];
  biomarkersReportsSnap.forEach((doc) => {
    reports.push({
      id: doc.id,
      ...doc.data()
    });
  });
  
  return reports;
}
async function saveMessages(chatDocRef, newMessages) {
  const chatDoc = await getDoc(chatDocRef);
  const existingMessages = chatDoc.exists() ? chatDoc.data().messages : [];
  const updatedMessages = [...existingMessages, ...newMessages];

  await updateDoc(chatDocRef, {
    messages: updatedMessages
  });
}
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
      chatDocRef = await addDoc(chatCollectionRef, {
        messages: [],
        active: true,
        createdAt: Math.floor(Date.now() / 1000)
      });
    }

    const apiMessages = [
      { role: "system", content: "You are a helpful assistant. You can access user profile data and biomarkers reports if needed." },
      ...previousMessages,
      { role: "user", content: message }
    ];

    const tools = [
      {
        type: "function",
        function: {
          name: "get_user_profile",
          description: "Get the user's profile data including age, gender, height, weight, and medical history",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      },
      {
        type: "function",
        function: {
          name: "get_biomarkers_reports",
          description: "Get the user's biomarkers reports from lab test analyses",
          parameters: {
            type: "object",
            properties: {},
            required: []
          }
        }
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: apiMessages,
      tools: tools,
      tool_choice: "auto",
    });

    let aiResponse = completion.choices[0].message.content;

    if (completion.choices[0].message.tool_calls) {
      const toolCalls = completion.choices[0].message.tool_calls;
      for (const toolCall of toolCalls) {
        if (toolCall.function.name === "get_user_profile") {
          const userProfileData = await fetchUserProfileData(uid);
          apiMessages.push({
            role: "function",
            name: "get_user_profile",
            content: JSON.stringify(userProfileData)
          });
        } else if (toolCall.function.name === "get_biomarkers_reports") {
          const biomarkersReports = await fetchBiomarkersReports(uid);
          apiMessages.push({
            role: "function",
            name: "get_biomarkers_reports",
            content: JSON.stringify(biomarkersReports)
          });
        }
      }

      const followUpCompletion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: apiMessages,
      });

      aiResponse = followUpCompletion.choices[0].message.content;
    }

    const newMessages = [
      { role: 'user', content: message },
      { role: 'assistant', content: aiResponse }
    ];

    await saveMessages(chatDocRef, newMessages);

    return NextResponse.json({ 
      content: aiResponse, 
      conversationId: chatDocRef.id 
    });
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json({ error: error.message || "Failed to fetch AI response." }, { status: 500 });
  }
}