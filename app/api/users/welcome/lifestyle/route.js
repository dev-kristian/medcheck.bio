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
  factor: z.string().describe("A risk factor associated with the condition."),
  severity: z.enum(['low', 'medium', 'high']).describe("The severity of the risk factor."),
}).strict();

const ProtectiveFactor = z.object({
  factor: z.string().describe("A protective factor that can mitigate the risks associated with the condition."),
  effectiveness: z.enum(['low', 'medium', 'high']).describe("The effectiveness of the protective factor."),
}).strict();

const Recommendation = z.object({
  recommendation: z.string().describe("A recommendation to improve or maintain health regarding the condition."),
  priority: z.enum(['low', 'medium', 'high']).describe("The priority of the recommendation."),
}).strict();

const Symptom = z.object({
  symptom: z.string().describe("A common symptom associated with the condition."),
  frequency: z.enum(['rare', 'occasional', 'frequent']).describe("The frequency of the symptom."),
}).strict();

const PotentialCondition = z.object({
  condition: z.string().describe("The potential health condition the user might be at risk for."),
  likelihood: z.enum(['low', 'medium', 'high']).describe("The likelihood of the user having or developing this condition."),
  description: z.string().describe("A detailed description of the condition and why the user might be at risk."),
  risk_factors: z.array(RiskFactor).describe("A list of risk factors associated with this condition."),
  protective_factors: z.array(ProtectiveFactor).describe("A list of protective factors that can mitigate the risks associated with this condition."),
  recommendations: z.array(Recommendation).describe("A list of recommendations to improve or maintain health regarding this condition."),
  symptoms: z.array(Symptom).describe("Common symptoms associated with this condition."),
}).strict();

const PotentialConditionsSchema = z.object({
  conditions: z.array(PotentialCondition),
}).strict();

const HealthScoreSchema = z.object({
  score: z.number().describe("The overall health score of the user, ranging from 0 to 100."),
  category: z.enum(['Excellent', 'Good', 'Fair', 'Poor']).describe("The category of the health score."),
  factors_influencing_score: z.array(z.string()).describe("A list of factors that influenced the health score."),
  recommendations_for_improvement: z.array(z.string()).describe("Recommendations to improve the health score."),
  description: z.string().describe("A detailed description of what the health score represents."),
}).strict();

const HealthAssessmentSchema = z.object({
  potential_conditions: PotentialConditionsSchema,
  health_score: HealthScoreSchema,
}).strict();

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
      model: "gpt-4o-2024-08-06",
      messages: [
        { role: "system", content: "Generate potential health conditions and a health score based on the user's profile data." },
        { role: "user", content: JSON.stringify(profileData) },
      ],
      response_format: zodResponseFormat(HealthAssessmentSchema, "health_assessment"),
      temperature: 0.2,
    });

    const healthAssessment = completion.choices[0].message;

    // Handle refusal
    if (healthAssessment.refusal) {
      return NextResponse.json({ error: 'Request refused by the model', details: healthAssessment.refusal }, { status: 400 });
    }

    const parsedHealthAssessment = healthAssessment.parsed;

    // Save the potential conditions and health score to the database
    const potentialConditionsRef = doc(collection(userRef, 'profileData'), 'potentialConditions');
    await setDoc(potentialConditionsRef, parsedHealthAssessment.potential_conditions, { merge: true });

    const healthScoreRef = doc(collection(userRef, 'profileData'), 'healthScore');
    await setDoc(healthScoreRef, parsedHealthAssessment.health_score, { merge: true });

    return NextResponse.json({ success: true, message: 'Lifestyle information updated successfully', healthAssessment: parsedHealthAssessment });
  } catch (error) {
    console.error('Error updating lifestyle data:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
