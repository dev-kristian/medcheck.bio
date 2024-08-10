// /pages/api/process-test.js

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { testType, date, additionalInfo } = req.body;

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
      model: "gpt-4-mini",
    });

    const analysis = completion.choices[0].message.content;

    res.status(200).json({ analysis });
  } catch (error) {
    console.error('Error processing test:', error);
    res.status(500).json({ message: 'Error processing test' });
  }
}
