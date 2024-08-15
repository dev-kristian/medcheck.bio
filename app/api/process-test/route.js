// /app/api/process-test/route.js

import { NextResponse } from 'next/server';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PRIVATE_OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { testType, date, images, additionalInfo } = await req.json();

    const messages = [
      { role: "system", content: "You are a helpful assistant that analyzes medical test information and images." },
      { 
        role: "user", 
        content: [
          {
            type: "text",
            text: `Analyze the following test information:
            Test Type: ${testType}
            Test Date: ${date}
            ${additionalInfo ? `Additional Information: ${additionalInfo}` : ''}
            
            Please provide a brief analysis of this test based on the information and the attached image(s).`
          },
          ...images.map(image => ({
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${image}`,
              detail: "high"
            }
          }))
        ]
      }
    ];

    const completion = await openai.chat.completions.create({
      messages: messages,
      model: "gpt-4o-mini",
    });

    const analysis = completion.choices[0].message.content;

    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Error processing test:', error);
    return NextResponse.json({ message: 'Error processing test' }, { status: 500 });
  }
}
