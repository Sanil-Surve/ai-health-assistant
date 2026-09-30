import { NextResponse } from "next/server";
import { SarvamAIClient } from "sarvamai";

const client = new SarvamAIClient({
  apiSubscriptionKey: process.env.SARVAM_API_KEY!,
});

type ConvertParams = Parameters<typeof client.textToSpeech.convert>[0];

export async function POST(req: Request) {
  try {
    const { text, language = "en-IN", speaker = "shubh" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }

    const response = await client.textToSpeech.convert({
      text,
      target_language_code: language as ConvertParams["target_language_code"],
      speaker: speaker as ConvertParams["speaker"],
      model: "bulbul:v3",
    });

    if (!response.audios || !response.audios[0]) {
      throw new Error("No audio returned from Sarvam API");
    }

    return NextResponse.json({ audio: response.audios[0] });
  } catch (error: any) {
    console.error("TTS Error:", error);
    return NextResponse.json(
      { error: error?.message || "Text-to-speech generation failed" },
      { status: 500 }
    );
  }
}
