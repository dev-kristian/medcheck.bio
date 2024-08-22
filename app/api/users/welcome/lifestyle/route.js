import { NextResponse } from 'next/server';
import { db } from '@/firebase/firebaseConfig';
import { doc, collection, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { verifyIdToken } from '@/app/api/middleware/auth';
import DOMPurify from 'dompurify';
import { JSDOM } from 'jsdom';
import { z } from 'zod';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';

// Create a DOMPurify instance with jsdom
const window = new JSDOM('').window;
const purify = DOMPurify(window);

export const maxDuration = 60; 
export const dynamic = 'force-dynamic';

// Define the Zod schema for the structured output
const RiskFactor = z.object({
  factor: z.string().describe("The specific health risk identified, e.g., 'Obesity', 'Cardiovascular Disease'."),
  description: z.string().describe("A detailed description of the risk factor, including how it relates to the user's profile data."),
  severity: z.enum(['low', 'medium', 'high']).describe("The severity level of the risk factor."),
  risk_level: z.string().describe("A detailed explanation of the risk level, e.g., 'High risk due to BMI over 30'."),
  impact: z.string().describe("The potential impact of this risk factor on the user's health."),
  related_conditions: z.array(z.string()).describe("A list of related health conditions or diseases associated with the risk factor."),
  preventive_measures: z.array(z.string()).describe("A list of preventive measures or recommendations to mitigate the risk."),
  recommendations: z.array(z.string()).describe("Specific recommendations tailored to the user's profile to address the risk factor."),
});

const RiskFactorsSchema = z.object({
  riskFactors: z.array(RiskFactor),
});

export async function PUT(request) {
  try {
    const verifiedUid = await verifyIdToken(request);
    const { userId, dailySleepPattern, dietaryHabits, physicalActivity, smokingHabits, alcoholConsumption } = await request.json();

    if (!userId || verifiedUid !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const userRef = doc(db, 'users', userId);
    const profileDataRef = doc(collection(userRef, 'profileData'), 'profile');

    // Check if the user document exists
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Sanitize the custom input for dietary habits
    const sanitizedDietaryHabits = purify.sanitize(dietaryHabits);

    const updateData = {
      dailySleepPattern: dailySleepPattern || 'Not specified',
      dietaryHabits: sanitizedDietaryHabits || 'Not specified',
      physicalActivity: physicalActivity || 'Not specified',
      smokingHabits: smokingHabits || 'Not specified',
      alcoholConsumption: alcoholConsumption || 'Not specified'
    };

    await setDoc(profileDataRef, updateData, { merge: true });

    await updateDoc(userRef, {
      lastCompletedSection: 4,
      profileCompleted: true,
    });

    // Fetch the updated profile data
    const updatedProfileDoc = await getDoc(profileDataRef);
    const profileData = updatedProfileDoc.data();

    // Initialize OpenAI client
    const client = new OpenAI({
      apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY,
    });

    // Generate structured output using GPT model
    const completion = await client.beta.chat.completions.parse({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Generate risk factors based on the user's profile data." },
        { role: "user", content: JSON.stringify(profileData) },
      ],
      response_format: zodResponseFormat(RiskFactorsSchema, "risk_factors"),
      temperature: 0.2,
    });

    const riskFactors = completion.choices[0].message.parsed;

    // Save the risk factors to the database
    const riskFactorsRef = doc(collection(userRef, 'profileData'), 'riskFactors');
    await setDoc(riskFactorsRef, riskFactors, { merge: true });

    return NextResponse.json({ success: true, message: 'Lifestyle information updated successfully', riskFactors });
  } catch (error) {
    console.error('Error updating lifestyle data:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
