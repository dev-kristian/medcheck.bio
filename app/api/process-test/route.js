// /app/api/process-test/route.js

import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { testType, date, additionalInfo } = await req.json();

    const prompt = `Analyze the following test information:
    Test Type: ${testType}
    Test Date: ${date}
    Additional Information: ${additionalInfo}

    Provide a brief analysis of this test.`;

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant that analyzes medical test information." },
        { role: "user", content: prompt }
      ],
      model: "gpt-4o-mini",
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error processing test:', error);
    return NextResponse.json({ message: 'Error processing test' }, { status: 500 });
  }
}
