import Groq from "groq-sdk";
import { NextResponse } from "next/server";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { text, history = [], language = 'en-IN' } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are Aura, an empathetic and clinically sound AI Health Assistant. Provide concise, clear, and reassuring medical guidance for conversational voice interaction. Keep responses to 2 to 3 sentences maximum (under 450 characters) so it sounds natural when spoken aloud. Output in simple language and in the language matching code: ${language}. Always advise consulting a physician for urgent symptoms.`,
        },
        ...history,
        { role: "user", content: text },
      ],
      model: "openai/gpt-oss-120b",
      temperature: 0.5,
      max_tokens: 250,
    });

    let aiResponse = completion.choices[0]?.message?.content || "I understand your concern. Please rest, drink plenty of water, and consult a doctor if symptoms persist.";
    if (aiResponse.length > 500) {
      aiResponse = aiResponse.substring(0, 496) + "...";
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error: any) {
    console.error("Groq analyze error:", error);
    return NextResponse.json(
      { response: "I am unable to analyze that right now. Please rest and consult a healthcare provider." },
      { status: 500 }
    );
  }
}