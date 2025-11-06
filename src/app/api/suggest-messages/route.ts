import { NextResponse } from 'next/server';
import OpenAI from 'openai';

// Use OpenAI SDK pointed at Groq's OpenAI-compatible endpoint
const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

export async function POST(req: Request) {
  try {
    // Static prompt: client calls complete('') just to trigger generation
    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    // Non-streaming completion, return plain JSON for client to consume
    const response = await groq.chat.completions.create({
      model: 'openai/gpt-oss-20b',
      max_tokens: 400,
      messages: [
        { role: 'user', content: prompt },
      ],
    });

    const text = response.choices[0]?.message?.content || '';
    return NextResponse.json({ text });
  } catch (error: any) {
    console.error('Suggest messages error:', error);
    return NextResponse.json(
      { error: error?.message ?? 'Failed to generate message suggestions' },
      { status: 500 }
    );
  }
}
